// Class to hold peers info
// i.e info about current computer`
class Peer {
  constructor (sessionId, device) {
    this.sessionId = sessionId;
    this.device = device;
    this.producers = [];
    this.consumers = [];

    this.mediaStream = new MediaStream();

    this.sendTransport = undefined;
    this.recvTransport = undefined;
  }

  hasVideo () {
    return Boolean(this.producers.find((producer => producer.kind === 'video')));
  }

  hasAudio () {
    return Boolean(this.producers.find((producer => producer.kind === 'audio')));
  }
}

export {Peer}
