import {mediaSoupConstants} from "../actions/types";

const initialState = {
    localVideoSrc : null,
    producers : []
};

export default function(state = initialState, action){
    switch(action.type){
        case mediaSoupConstants.Create_Local_Stream:
            return {
                ...state,
                localVideoSrc: action.src
            };

        case mediaSoupConstants.Active_Producers:
            return {
                ...state,
                producers: action.data.active_producers
            };

        default:
            return state;
    }
}