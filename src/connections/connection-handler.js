/**
 * @module src/connections/connection-handler.js
 *
 * Base class for handling connection states in the game.
 * Used as a parent for stateful game flows like login, character creation, and gameplay.
 */

'use strict';

/**
 * Represents an abstract connection handler for a telnet session.
 * Subclasses should override `handle()`, `enter()`, `leave()`, and `hungup()` as needed.
 */
class ConnectionHandler {
  /**
   * @param {import("./connection")} connection
   */
  constructor(connection) {
    /** @type {import("./connection")} connection */
    this.connection = connection;

    /** @type {string} */
    this.name = this.constructor.name;
  }

  /**
   * Called when data is received from the socket.
   * This method should be overridden in subclasses.
   *
   * @param {string} input - The raw input string received from the player.
   */
  // eslint-disable-next-line no-unused-vars
  handle(input) {
    // Default: no-op
  }

  /**
   * Called when this handler becomes the active state for the connection.
   * Typically invoked when a new session begins or control is transferred.
   */
  enter() {
    console.log(`[${this.name}] Player connected from ${this._addr()}`);
  }

  /**
   * Called when this handler is being removed or replaced by another handler.
   * Useful for cleanup or transition logging.
   */
  leave() {
    console.log(`[${this.name}] Leaving handler for ${this._addr()}`);
  }

  /**
   * Called when the socket is closed (e.g., the user disconnects).
   */
  hungup() {
    console.log(`[${this.name}] Disconnected: ${this._addr()}`);
  }

  /**
   * Utility method to return the remote socket address and port.
   *
   * @returns {string} IP and port in the format `address:port`.
   * @private
   */
  _addr() {
    const { remoteAddress, remotePort } = this.connection.socket;
    return `${remoteAddress}:${remotePort}`;
  }
}

module.exports = ConnectionHandler;
