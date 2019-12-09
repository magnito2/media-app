/**
 * this queue class plays a very vital role in relating messages from mediasoup
 * client and communication namely socketio. Mediasoup generates events that 
 * need to be relayed to the server and the server sends responses that need to
 * be relayed to the client.
 */

module.exports = class SocketQueue{
    constructor(){
        this.queue = new Map();        
    }

     push (action, callback) {
         this.queue.set(action, callback);
     }

    get (action) {
        return this.queue.get(action);
    }
   
    remove (action) {
        this.queue.delete(action);
    }
}

