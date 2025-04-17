'use strict';

/**
 * @typedef {Object} ConnectionHandler
 * @property {() => void} enter - Called when this handler becomes active.
 * @property {() => void} leave - Called when this handler is removed or deactivated.
 * @property {(input: string) => void} handle - Processes incoming text input.
 * @property {() => void} [hungup] - Optional cleanup method when the socket is closed.
 */

/**
 * Represents a network connection for a player, handling protocol translation,
 * input buffering, and a stack of active handlers.
 */
class connection {
  /**
   * @param {import('net').Socket} socket - The underlying network socket.
   * @param {{ translate: (msg: string) => string }} protocol - Protocol to format outgoing messages.
   */
  constructor(socket, protocol) {
    /** @type {import('net').Socket} */
    this.socket = socket;

    /** @type {{ translate: (msg: string) => string }} */
    this.protocol = protocol;

    /** @type {ConnectionHandler[]} */
    this.handlers = [];

    /** @type {boolean} */
    this.isClosed = false;

    /** @type {string} */
    this.buffer = '';

    this._bindEvents();
  }

  /**
   * Adds a new handler to the connection and calls its `enter()` method.
   * @param {ConnectionHandler} handler
   */
  addHandler(handler) {
    const current = this._handler();
    if (current) current.leave();
    this.handlers.unshift(handler);
    this._handler()?.enter();
  }

  /**
   * Removes the current handler and activates the next one, if available.
   */
  removeHandler() {
    const current = this._handler();
    if (current) current.leave();
    this.handlers.shift();
    this._handler()?.enter();
  }

  /**
   * Sends a translated message to the player's socket.
   * @param {string} message
   */
  sendMessage(message) {
    try {
      if (this.socket && !this.socket.destroyed && this.socket.writable) {
        this.socket.write(this.protocol.translate(message));
      }
    } catch {
      this.close();
    }
  }

  /**
   * Removes all handlers and calls `leave()` on the current one if present.
   */
  clearHandlers() {
    const current = this._handler();
    if (current) current.leave();
    this.handlers = [];
  }

  /**
   * Gracefully closes the socket and cleans up.
   */
  close() {
    this.isClosed = true;
    this.socket.end();
  }

  /**
   * @returns {ConnectionHandler | undefined} The current active handler.
   * @private
   */
  _handler() {
    return this.handlers.length ? this.handlers[0] : undefined;
  }

  /**
   * Binds low-level socket events.
   * @private
   */
  _bindEvents() {
    this.socket.on('data', this._receivedData.bind(this));
    this.socket.on('close', this._connectionClosed.bind(this));
  }

  /**
   * Buffers incoming data and delegates complete input lines to the handler.
   * Applies known telnet client compatibility fixes.
   * @param {Buffer} data
   * @private
   */
  _receivedData(data) {
    // Putty Telnet: ignore negotiation
    if (data.includes(Buffer.from('fffb1f', 'hex'))) return;

    const dataStr = data.toString();

    // Microsoft Telnet client fix
    if (!this.buffer.length && dataStr.match(/[\b]/)) {
      this.socket.write(' ');
    }

    this.buffer += dataStr.match(/[\b]/) ? '' : dataStr;

    if (this.buffer.length && dataStr !== ' \b' && dataStr.match(/[\b]/)) {
      this.buffer = this.buffer.slice(0, -1);
      this.socket.write(' \b');
    }

    if (this.buffer.includes('\n')) {
      this._handler()?.handle(this.buffer.replace(/[\r\n]*$/, ''));
      this.buffer = '';
    }
  }

  /**
   * Invoked when the socket is closed externally.
   * @private
   */
  _connectionClosed() {
    const current = this._handler();
    if (!this.isClosed && current?.hungup) current.hungup();
    this.clearHandlers();
    this.isClosed = true;
  }
}

module.exports = connection;
