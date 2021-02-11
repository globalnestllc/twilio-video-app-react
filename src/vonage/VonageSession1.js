import React from 'react';
import { apiKey, initialVideoContainer, subscriberOptions } from './Config';
import { getSession } from '../Api/ApiServices';

export default class VonageSession {
  constructor(session, token) {
    // super({apiKey, sessionId, token});

    this.session = null;
    this.subscribers = { camera: {}, screen: {} };
    this.publishers = { camera: {}, screen: {} };
    this.testValue = 1;
    window.vonageSession = this;
  }

  _initEvents() {
    // this.session.on('streamCreated', _subscribeToStream);
    // this.session.on('connectionCreated', _setConnections);
    // this.session.on('connectionDestroyed', _setConnections);
  }

  destroy() {
    // this.session.off('streamCreated', this._subscribeToStream);
    // this.session.off('connectionCreated', this._setConnections);
    // this.session.off('connectionDestroyed', this._setConnections);
  }

  setSessionMedia() {
    let screenShareParticipant = null;

    let screenPublishers = Object.values(this.publishers.screen);
    let cameraPublishers = Object.values(this.publishers.camera);
    let screenSubscribers = Object.values(this.subscribers.screen);
    let cameraSubscribers = Object.values(this.subscribers.camera);

    if (screenPublishers.length) {
      screenShareParticipant = { camera: cameraPublishers[0], screen: screenPublishers[0] };
    } else if (screenSubscribers.length > 0) {
      // Find the camera source of the screen sharing participant.
      let screen = screenSubscribers[0];
      let camera = cameraSubscribers.find(
        subscriber => subscriber.stream.connection.id === screen.stream.connection.id
      );
      screenShareParticipant = { camera, screen };
    } else {
      console.log('setScreenShareParticipant null;');
      screenShareParticipant = null;
    }

    return {
      publishers: cameraPublishers,
      subscribers: cameraSubscribers,
      screenPublishers,
      screenSubscribers,
      screenShareParticipant,
      viewingSharedScreen: screenSubscribers.length,
      screenShareActive: screenSubscribers.length || screenPublishers.length,
    };
  }

  _setConnections() {
    this.connections = this.session.connections
      .map(c => c)
      .filter(connection => !connection.id.includes('.tokbox.com'));
    this.connection = this.session.connection;
  }

  _addPublisher(publisher, type) {
    this.publishers[type][publisher.id] = publisher;
    // console.log('add-remove _addPublisher', publishers[type], publisher, pub[type])
  }

  _removePublisher(publisher, type) {
    delete this.publishers[type][publisher.id];
    console.log('add-remove _removePublisher', this.publishers[type], publisher);
  }

  _addSubscriber(subscriber, type) {
    this.subscribers[type][subscriber.id] = subscriber;
    console.log('add-remove _addSubscriber', type, subscriber);
  }

  _removeSubscriber(subscriber, type) {
    delete this.subscribers[type][subscriber.id];
    console.log('add-remove _removeSubscriber', type, subscriber);
  }

  publish(publisher, type) {
    return new Promise((resolve, reject) => {
      this.session.publish(publisher, error => {
        if (error) {
          reject(error);
        } else {
          this._addPublisher(publisher, type);
          resolve('ok');
        }
      });
    });
  }

  unpublish(publisher, type) {
    // console.log('unpublish', type, publishers[type], publishers, publisher.id, publisher.stream, publisher)
    return new Promise((resolve, reject) => {
      this._removePublisher(publisher, type);
      this.session.unpublish(publisher);
      resolve('ok');
    });
  }

  _subscribeToStream(stream) {
    // console.log('subscribeToStream', stream.id, subscribers)
    let subscriber = this.session.subscribe(stream, initialVideoContainer, subscriberOptions, error => {
      if (error) {
        console.log('Subscription error', error);
      } else {
        this._addSubscriber(subscriber, stream.videoType);

        subscriber.on('destroyed', () => {
          console.log("subscriber.on('destroyed'");
          this._removeSubscriber(subscriber, stream.videoType);
        });
        console.log('Subscription success');
      }
    });
  }

  async connect(roomName, name) {
    let sessionData = await getSession(roomName);
    this.sessionData = sessionData;

    let token = ''; //await getToken(name, sessionData.roomName);
    let _session = window.OT.initSession(apiKey, sessionData.sessionId);
    this.session = _session;

    return new Promise((resolve, reject) => {
      // if (isConnecting || isConnected) {
      //     console.log('otCore startCall() return');
      //     return;
      // }

      // setUserName(name);

      console.log('otCore startCall() yeah', name);
      // setIsConnecting(true);

      _session.connect(token, error => {
        if (error) {
          // setIsConnecting(false);
          reject(error.message);
        } else {
          resolve(_session);
          // startCall();
        }
      });
    });
  }

  disconnect() {
    return this.session.disconnect();
  }
}
