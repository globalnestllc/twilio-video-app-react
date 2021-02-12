import React from 'react';
import { apiKey, initialVideoContainer, subscriberOptions } from './Config';
import { OpenTokSDK } from 'opentok-accelerator-core';
import TextChatAccPack from 'opentok-text-chat';

const message = messageText => console.log(`VonageSession: ${messageText}`);

const textChatOptions = {
  session: null,
  sender: {
    id: 'chat-panel',
    alias: 'David',
  },
  limitCharacterMessage: 160,
  controlsContainer: '#chat-panel',
  textChatContainer: '#chat-panel',
  alwaysOpen: true,
  appendControl: true,
};

export default class VonageSession extends OpenTokSDK {
  constructor(sessionId, token, name, onStateUpdated) {
    super({ apiKey, sessionId, token });
    this.publishLocal = this.publishLocal.bind(this);
    this.startCall = this.startCall.bind(this);

    this.name = name;
    this.onStateUpdated = onStateUpdated;
    this.testValue = 1;
    this.eventListeners = {};

    window.vonageSession = this;
  }

  publishLocal(publisher) {
    if (!publisher) {
      debugger; // this shouldn't be null!
    }

    publisher.on('streamCreated', this.onStateUpdated);
    publisher.on('streamDestroyed', this.onStateUpdated);
    publisher.on('mediaStopped', this.onStateUpdated);

    super.publishPreview(publisher).then(this.onStateUpdated);
  }

  async connect(eventListeners) {
    await super.connect(eventListeners);

    textChatOptions.session = this.session;
    textChatOptions.accPack = this;
    textChatOptions.sender = { alias: this.name, id: this.session.connection.id };
    this.textChat = new TextChatAccPack(textChatOptions);
  }

  startCall() {
    const { streamMap } = this.state();

    const subscribeToStream = stream => {
      if (streamMap && streamMap[stream.id]) {
        return;
      }
      const type = stream.videoType;
      this.subscribe(stream, initialVideoContainer, subscriberOptions).then(s => this.onStateUpdated(s));
    };

    // Subscribe to initial streams
    this.session.streams.forEach(subscribeToStream);

    // Subscribe to new streams and update state when streams are destroyed
    this.on({
      streamCreated: ({ stream }) => subscribeToStream(stream),
      streamDestroyed: ({ stream }) => this.onStateUpdated(stream),
    });
  }

  /**
   * Register events that can be listened to be other components/modules
   * @param {array | string} events - A list of event names. A single event may
   * also be passed as a string.
   */
  registerEvents = events => {
    // const {eventListeners} = this;
    // const eventList = Array.isArray(events) ? events : [events];
    // eventList.forEach((event) => {
    //     if (!eventListeners[event]) {
    //         eventListeners[event] = new Set();
    //     }
    // });
  };

  /**
   * Register a callback for a specific event or pass an object with
   * with event => callback key/value pairs to register listeners for
   * multiple events.
   * @param {String | Object} event - The name of the event
   * @param {Function} callback
   */

  registerEventListener(event, callback) {
    const { eventListeners, on } = this;
    // analytics.log(logAction.on, logVariation.attempt);
    if (typeof event === 'object') {
      Object.keys(event).forEach(eventName => {
        on(eventName, event[eventName]);
      });
      return;
    }
    let eventCallbacks = eventListeners[event];
    if (!eventCallbacks) {
      eventCallbacks = new Set();
      eventListeners[event] = eventCallbacks;
    }
    eventCallbacks.add(callback);
  }

  /**
   * Remove a callback for a specific event.  If no parameters are passed,
   * all event listeners will be removed.
   * @param {String} event - The name of the event
   * @param {Function} callback
   */
  removeEventListener(event, callback) {
    const { eventListeners } = this;
    // analytics.log(logAction.off, logVariation.attempt);
    if (!event && !callback) {
      Object.keys(eventListeners).forEach(eventType => {
        eventListeners[eventType].clear();
      });
    } else {
      const eventCallbacks = eventListeners[event];
      if (!eventCallbacks) {
        // analytics.log(logAction.off, logVariation.fail);
        message(`${event} is not a registered event.`);
      } else {
        eventCallbacks.delete(callback);
        // analytics.log(logAction.off, logVariation.success);
      }
    }
  }

  /**
   * Trigger an event and fire all registered callbacks
   * @param {String} event - The name of the event
   * @param {*} data - Data to be passed to callback functions
   */
  triggerEvent = (event, data) => {
    const { eventListeners, registerEvents } = this;
    const eventCallbacks = eventListeners[event];
    if (!eventCallbacks) {
      registerEvents(event);
      message(`${event} has been registered as a new event.`);
    } else {
      eventCallbacks.forEach(callback => callback(data, event));
    }
  };
}
