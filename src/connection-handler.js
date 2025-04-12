'use strict';

class ConnectionHandler {
  constructor(connection) {
    this.connection = connection;
    this.name = this.constructor.name;
  }

  /**
   * Called when data is received from the socket.
   * Override this in child handlers.
   */
  handle() {
  }

  /**
   * Called when the handler becomes active (e.g., new connection or state change)
   */
  enter() {
    console.log(`[${this.name}] Player connected from ${this._addr()}`);
  }

  /**
   * Called when this handler is being removed or replaced
   */
  leave() {
    console.log(`[${this.name}] Leaving handler for ${this._addr()}`);
  }

  /**
   * Called when the socket is closed (hangup)
   */
  hungup() {
    console.log(`[${this.name}] Disconnected: ${this._addr()}`);
  }

  _addr() {
    const { remoteAddress, remotePort } = this.connection.socket;
    return `${remoteAddress}:${remotePort}`;
  }
}

module.exports = ConnectionHandler;
