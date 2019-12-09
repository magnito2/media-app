import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import webSocketReducer from "./webSocketReducer";
import mediaSoupReducer from "./mediaSoupReducer";

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    websocket : webSocketReducer,
    mediaSoup: mediaSoupReducer
});