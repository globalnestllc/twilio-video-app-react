import React from 'react';
import useRoomState from '../hooks/useRoomState/useRoomState';
import { useAppState } from '../state';
import VonageSession from './VonageSession';

const events = [
  'subscribeToCamera',
  'unsubscribeFromCamera',
  'subscribeToScreen',
  'unsubscribeFromScreen',
  'startScreenShare',
  'endScreenShare',
  'sessionConnected',
  'sessionDisconnected',
  'sessionReconnected',
  'sessionReconnecting',
  'streamCreated',
  'connectionCreated',
  'connectionDestroyed',
  'streamDestroyed',
  'streamPropertyChanged',
];

const customEvents = [
  //Text chat
  'messageSent',
  'errorSendingMessage',
  'messageReceived',
];

export default function useSession() {
  const [sessionData, setSessionData] = React.useState({ sessionId: null, roomName: null });
  const [connections, setConnections] = React.useState([]);
  const [connection, setConnection] = React.useState({});
  const [vonageSession, setVonageSession] = React.useState(null);
  const [val, forceUpdate] = React.useState(1);

  const { getToken, getSession, displayName, setUserName } = useAppState();

  const { roomState } = useRoomState(vonageSession);

  const state = vonageSession?.state();

  function updateState(eventName, event) {
    console.log('updateState event', eventName, event);

    const _setConnections = () => {
      if (vonageSession) {
        setConnections(
          vonageSession.session.connections.map(c => c).filter(connection => !connection.id.includes('.tokbox.com'))
        );
        setConnection(vonageSession.session.connection || {});
      }
    };
    _setConnections();

    forceUpdate(val => {
      console.log('force update ', val);
      return val + 1;
    });
  }

  React.useEffect(() => {
    const _updateState = (event, eventName) => {
      updateState(eventName || event.type, event);
    };

    if (vonageSession) {
      events.forEach(eventName => {
        vonageSession.on(eventName, _updateState);
      });
      customEvents.forEach(eventName => {
        vonageSession.registerEventListener(eventName, _updateState);
      });
      return () => {
        events.forEach(eventName => {
          vonageSession.off(eventName, _updateState);
        });
        customEvents.forEach(eventName => {
          vonageSession.removeEventListener(eventName, _updateState);
        });
      };
    }
  }, [vonageSession]);

  let { publish, unpublish, publishLocal, disconnect } = React.useMemo(() => {
    if (!vonageSession) return {};

    return {
      publish: vonageSession.publishPreview,
      unpublish: vonageSession.unpublish,
      publishLocal: vonageSession.publishLocal,
      // connect: vonageSession.connect,
      disconnect: vonageSession.disconnect,
    };
  }, [vonageSession]);

  let sessionMedia = React.useMemo(() => {
    if (!vonageSession?.state()) {
      return {
        publishers: [],
        subscribers: [],
        screenPublishers: [],
        screenSubscribers: [],
        screenShareParticipant: null,
        viewingSharedScreen: false,
        screenShareActive: false,
      };
    }
    const { publishers, subscribers } = vonageSession?.state();

    let screenShareParticipant = null;
    let screenPublishers = Object.values(publishers.screen);
    let cameraPublishers = Object.values(publishers.camera);
    let screenSubscribers = Object.values(subscribers.screen);
    let cameraSubscribers = Object.values(subscribers.camera);

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
      screenShareParticipant = null;
    }

    let media = {
      publishers: cameraPublishers,
      subscribers: cameraSubscribers,
      screenPublishers,
      screenSubscribers,
      screenShareParticipant,
      viewingSharedScreen: screenSubscribers.length,
      screenShareActive: screenSubscribers.length || screenPublishers.length,
    };

    return media;
  }, [Object.values(state?.publishers?.camera || {}), state?.subscribers?.camera]);

  const connect = async (roomName, name) => {
    try {
      setUserName(name);
      let sessionData = await getSession(roomName);
      setSessionData(sessionData);
      let token = await getToken(name, sessionData.roomName);

      let _vonageSession = new VonageSession(sessionData.sessionId, token, name, event =>
        updateState('internal', event)
      );

      setVonageSession(_vonageSession);
      await _vonageSession.connect();
      _vonageSession.startCall();
      return _vonageSession;
    } catch (e) {
      console.log('connect error', e);
    }
  };

  return {
    ...sessionMedia,
    connection,
    connections,
    publish,
    publishLocal,
    unpublish,
    connect,
    disconnect,
    roomState,
    sessionData,
    val,
    vonageSession,
  };
}
