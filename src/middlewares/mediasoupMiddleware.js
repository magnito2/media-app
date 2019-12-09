import {mediaSoupConstants} from "../actions/types";
import {mediaSoupActions} from "../actions";
import {websocketActions} from "../actions";
import {Soup} from "../mediasoup";

import global_store from "../store";

const mediasoup = require('mediasoup-client');

const mediaSoupMiddleware = () => {
    let device = null;
    let peer = null;
    const produceQueue = new Soup.SocketQueue();
    const consumeQueue = new Soup.SocketQueue();

    // support functions
    const handleSendTransportListeners = () => {
        console.log("Setting up listeners for send transport");
        peer.sendTransport.on('connect', handleProducerTransportConnectEvent);
        peer.sendTransport.on('produce', handleTransportProduceEvent);
        peer.sendTransport.on('connectionstatechange', connectionState => {
            console.log('send transport connection state change [state:%s]', connectionState);
        });
    };

    const handleRecvTransportListeners = () => {
        console.log("Setting up listeners for recv transport");
        peer.recvTransport.on('connect', handleConsumerTransportConnectEvent);
        peer.recvTransport.on('connectionstatechange', handleConsumerConnectionStateChanges);
    };

    const getMediaStream = async () => {
        console.log("Getting the media stream now");
        const mediaStream = await Soup.GUM();
        console.log("Our media stream is ", mediaStream);
        const videoNode = document.getElementById('localVideo');
        videoNode.srcObject = mediaStream;

        //const mediaUrl = window.URL.createObjectURL(mediaStream);
        //global_store.dispatch(mediaSoupActions.createLocalStream(mediaUrl));

        // Get the video and audio tracks from the media stream
        const videoTrack = mediaStream.getVideoTracks()[0];
        const audioTrack = mediaStream.getAudioTracks()[0];

        // If there is a video track start sending it to the server
        if (videoTrack) {
            const videoProducer = await peer.sendTransport.produce({ track: videoTrack });
            peer.producers.push(videoProducer);
        }

        // if there is a audio track start sending it to the server
        if (audioTrack) {
            const audioProducer = await peer.sendTransport.produce({ track: audioTrack });
            peer.producers.push(audioProducer);
        }
    };

    const handleProducerTransportConnectEvent = ({ dtlsParameters }, callback, errback) => {
        console.log('handleProducerTransportConnectEvent()');
        try {
            const action = (jsonMessage) => {
                console.log('produce connect-transport action');
                callback();
                produceQueue.remove('connect-transport');
            };

            produceQueue.push('connect-transport', action);

            global_store.dispatch(websocketActions.send({
                action: 'connect-transport',
                sessionId: peer.sessionId,
                transportId: peer.sendTransport.id,
                dtlsParameters,
                transportType: "PRODUCER"
            }));

        } catch (error) {
            console.error('handleProducerTransportConnectEvent() failed [error:%o]', error);
            errback(error);
        }
    };

    const handleConsumerTransportConnectEvent = ({ dtlsParameters }, callback, errback) => {
        console.log('handleConsumerTransportConnectEvent()');
        try {
            const action = (jsonMessage) => {
                console.log('consume connect-transport action');
                callback();
                consumeQueue.remove('connect-transport');
            };

            consumeQueue.push('connect-transport', action);

            global_store.dispatch(websocketActions.send({
                action: 'connect-transport',
                sessionId: peer.sessionId,
                transportId: peer.recvTransport.id,
                dtlsParameters,
                transportType: "CONSUMER"
            }));

        } catch (error) {
            console.error('handleConsumerTransportConnectEvent() failed [error:%o]', error);
            errback(error);
        }
    };

    const handleTransportProduceEvent = ({ kind, rtpParameters }, callback, errback) => {
        console.log('handleTransportProduceEvent()');
        try {
            const action = jsonMessage => {
                console.log('handleTransportProduceEvent callback [data:%o]', jsonMessage);
                callback({ id: jsonMessage.id });
                produceQueue.remove('produce');
            };

            produceQueue.push('produce', action);

            global_store.dispatch(websocketActions.send({
                action: 'produce',
                sessionId: peer.sessionId,
                transportId: peer.sendTransport.id,
                kind,
                rtpParameters
            }));

        } catch (error) {
            console.error('handleTransportProduceEvent() failed [error:%o]', error);
            errback(error);
        }
    };

    const handleConsumerConnectionStateChanges = connectionState => {
        console.log("Consumer connection state has changed to ", connectionState);
        switch (connectionState) {
            case "connected":
                const consumer = peer.consumers[0];
                console.log("Our consumer is ", consumer, " of track ", consumer.track);
                break;
            default:
                break;
        }
    }

    //the middleware part now

    return store => next => action => {
        switch (action.type) {
            case mediaSoupConstants.Router_RTP_Capabilities:
                const {routerRtpCapabilities, sessionId } = action.data;
                if(device !== null){
                    device.close();
                }
                try{
                    device = new mediasoup.Device();
                    device.load({ routerRtpCapabilities }).then(() => {
                        peer = new Soup.Peer(sessionId, device);
                        console.log("loaded the device successfully");
                    });
                } catch(error){
                    if (error.name === 'UnsupportedError') {
                        console.error('browser not supported');
                    }
                    else{
                        console.error(error);
                    }
                }
                return next(action);
                //break;

            case mediaSoupConstants.Create_Transport:
                const transportType = action.transportType;
                console.log("Creating transport of type ",transportType);
                store.dispatch(websocketActions.send({
                    action: 'create-transport',
                    sessionId: peer.sessionId,
                    transportType: transportType
                }));
                return next(action);

            case mediaSoupConstants.Transport_Created:
                console.log('Server transport has been created', action);
                try{
                    const {transportType} = action.data;
                    if(transportType === "PRODUCER"){
                        //create the local mediasoup send transport
                        peer.sendTransport = peer.device.createSendTransport(action.data);

                        //let us set some listeners to the transport
                        handleSendTransportListeners();
                        getMediaStream();

                    }else if(transportType === "CONSUMER"){
                        peer.recvTransport = peer.device.createRecvTransport(action.data);

                        //set up event listeners
                        handleRecvTransportListeners();

                        //tell server to create a consumer for us
                        const { rtpCapabilities } = peer.device;
                        console.log('our rtp capabilities are ', rtpCapabilities);
                        store.dispatch(websocketActions.send({
                            action : 'consume',
                            sessionId: peer.sessionId,
                            transportId : peer.recvTransport.id,
                            rtpCapabilities
                            //@todo add producerID
                        }));


                    }else{
                        console.error('you need to specify the transport type')
                    }

                } catch (error) {
                    console.error('failed to create transport [error:%o]', error);
                    //store.dispatch() be dispatching an error here
                }
                return next(action);
                //break;

            case mediaSoupConstants.Transport_Connected:
                console.log('Server transport has been connected', action);
                console.log('handleTransportConnectRequest()');
                try {
                    const {transportType} = action.data;
                    let f_action;
                    if(transportType === "PRODUCER"){
                        f_action = produceQueue.get('connect-transport');
                        console.log('Our f_action is ', f_action);

                    }else if(transportType === "CONSUMER"){
                        f_action = consumeQueue.get('connect-transport');
                        console.log('Our f_action is ', f_action);

                    }
                    if (!f_action) {
                        throw new Error('transport-connect action was not found');
                    }

                    f_action({"action": "connect-transport"});
                } catch (error) {
                    console.error('handleTransportConnectRequest() failed [error:%o]', error);
                }
                return next(action);
                //break;

            case mediaSoupConstants.Produce:
                console.log("We just got a go ahead to produce");
                try {
                    const f_action = produceQueue.get('produce');

                    if (!f_action) {
                        throw new Error('produce action was not found');
                    }

                    f_action(action.data);
                } catch (error) {
                    console.error('handleProduceRequest() failed [error:%o]', error);
                }
                return next(action);
                //break;

            case mediaSoupConstants.Consume:
                console.log("We just got a go ahead to consume", action.data);
                const {
                    producerId,
                    id,
                    kind,
                    rtpParameters,
                } = action.data;
                let codecOptions = {};

                peer.recvTransport.consume({
                    id,
                    producerId,
                    kind,
                    rtpParameters,
                    codecOptions,
                }).then(consumer => {
                    console.log("Consumer ", consumer);
                    peer.consumers.push(consumer);
                    console.log("Consumer track ", consumer.track);
                    peer.mediaStream.addTrack(consumer.track);

                    const videoNode = document.getElementById('remoteVideo');
                    videoNode.srcObject = peer.mediaStream;

                }).catch(error => console.error(error));

                return next(action);
            //break;

            default:
                return next(action);
        }
    };
};


const mediaSoup = mediaSoupMiddleware();
export {mediaSoup as mediaSoupMiddleware};