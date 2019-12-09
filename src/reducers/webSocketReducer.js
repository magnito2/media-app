import {webSocketConstants} from "../actions/types";

const initialState = {
    connected : false
};

export default function(state = initialState, action){
    switch(action.type){
        case webSocketConstants.Connected:
            return {
                ...state,
                connected : true
            };

        case webSocketConstants.Disconnected:
            return {
                ...state,
                connected: false
            };

        default:
            return state;
    }
}