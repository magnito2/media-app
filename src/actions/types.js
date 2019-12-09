export const GET_ERRORS = "GET_ERRORS";
export const USER_LOADING = "USER_LOADING";
export const SET_CURRENT_USER = "SET_CURRENT_USER";

//constants to be used with websockets

export const webSocketConstants = {
    Connect : 'WS_CONNECT',
    Connecting : 'WS_CONNECTING',
    Connected : 'WS_CONNECTED',
    Connection_Failed : 'WS_CONNECTION_FAILED',
    Disconnect : 'WS_DISCONNECT',
    Disconnected : 'WS_DISCONNECTED',
    Send : 'WS_SEND',
    Sending : 'WS_SENDING'
};

export const mediaSoupConstants = {
    Router_RTP_Capabilities : 'MediaSoup_Router_RTP_Capabilities', //response from server when connected
    Create_Transport : 'MediaSoup_Create_Transport', //ask the server to create a transport for this device
    Transport_Created : 'MediaSoup_Transport_Created', //response received from server that transport has been created
    Create_Local_Stream : 'MediaSoup_Create_Local_Stream', //attach gum to video src through this
    Transport_Connected : 'MediaSoup_Transport_Connected', //response received from server that transport has been connected
    Produce : 'MediaSoup_Produce', //server now ready for device to produce
    Consume : 'MediaSoup_Consume',
    Active_Producers : 'MediaSoup_Active_Producers'

};
