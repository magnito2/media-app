import {mediaSoupConstants} from "./types";

const routerRTPCapabilities = data => ({ type: mediaSoupConstants.Router_RTP_Capabilities, data});
const createTransport = transportType => ({ type: mediaSoupConstants.Create_Transport, transportType});
const transportCreated = data => ({ type: mediaSoupConstants.Transport_Created, data});
const createLocalStream = src => ({ type: mediaSoupConstants.Create_Local_Stream, src});
const transportConnected = data => ({ type: mediaSoupConstants.Transport_Connected, data});
const produce = data => ({ type: mediaSoupConstants.Produce, data});
const consume = data => ({ type: mediaSoupConstants.Consume, data});
const activeProducers = data => ({ type: mediaSoupConstants.Active_Producers, data});

export const mediaSoupActions = {
    routerRTPCapabilities,
    createTransport,
    transportCreated,
    createLocalStream,
    transportConnected,
    produce,
    consume,
    activeProducers
};