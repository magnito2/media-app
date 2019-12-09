/**
 * Okay, lets see how we want this to play
 * 1. the user navigates to the page (student or teacher)
 * 2. constructor of this class kicks of the process, calls action to create ws. this should run detached from page activities, dispatch.
 * 3. ws connects to server, gets rtccapabilities
 * 4. mediasoup creates and loads device
 * 5. events to listen to transport are set up
 * 6. the ball is played until the video is delivered on pause i.e ready to transmit, ready to recieve
 * 7. click to play/record
 */
 
import {webSocketConstants} from "./types";
import {mediaSoupActions} from "./mediaSoupActions";

let socket = null;

export const websocketActions = {
    connect,
    disconnect,
    send
};

function connect(){
    return dispatch => {
        dispatch(request());
        
        if (socket !== null) {
          socket.close();
        }

        //connect to the remote host
        socket = new WebSocket(`wss://${window.location.hostname}:3000/api`);
        //socket = new WebSocket(`ws://localhost:4000`);

        //websocket handlers
        socket.onopen = (event) => dispatch(success(event));
        socket.onclose = (event) => dispatch(onclose(event));
        socket.onerror = (event) => dispatch(failure(event));

        socket.onmessage = async (event) => {
            try{
                await handleSocketMessage(event, dispatch);
            } 
            catch(error){
                console.error(error);
                dispatch(failure(event));
            }
        };
    };

    function request() { return {type : webSocketConstants.Connect }}
    function success(event) { return {type : webSocketConstants.Connected }}
    function onclose(event) {return {type : webSocketConstants.Disconnected }}
    function failure(event){
        console.log("event ", event);
        return {
        type : webSocketConstants.Connection_Failed,
        message : event.message
    }};

    async function handleSocketMessage(event, dispatch){
        
        const data = JSON.parse(event.data);
        console.log(data);

        const {action} = data;

        switch(action){
            case 'router-rtp-capabilities':
                dispatch(mediaSoupActions.routerRTPCapabilities(data));
                break;

            case 'create-transport':
                dispatch(mediaSoupActions.transportCreated(data));
                break;

            case 'connect-transport':
                dispatch(mediaSoupActions.transportConnected(data));
                break;

            case 'produce':
                dispatch(mediaSoupActions.produce(data));
                break;

            case 'consume':
                dispatch(mediaSoupActions.consume(data));

            case 'active-producers':
                dispatch(mediaSoupActions.activeProducers(data));
                break;

            default:
                console.log("couldn't handle ", action);
                break;
        };

        return true;

    }
}

function disconnect() {
    return dispatch => {
        if(socket != null){
            dispatch(request());
            socket.close();
            socket = null;
        }

    };

    function request() { return {type: webSocketConstants.Disconnect}}
    function success() {return {type: webSocketConstants.Disconnected}}
}

function send(data) {
    return dispatch => {
        if(socket != null){
            dispatch(request(data));
            socket.send(JSON.stringify(data));
        }
    };

    function request() { return {type: webSocketConstants.Sending, data: data}}

}