import React, { useCallback } from 'react';
import useRoomState from '../hooks/useRoomState/useRoomState';
import { initialVideoContainer, subscriberOptions } from './Config';
import { useAppState } from '../state';

let apiKey = '47099484';

export default function useSession(session) {
  const [vonageSession, setSession] = React.useState(null);
  const [sessionData, setSessionData] = React.useState({ sessionId: null, roomName: null });
  const [connections, setConnections] = React.useState([]);
  const [connection, setConnection] = React.useState({});

  const { getToken, getSession, displayName, setUserName } = useAppState();

  const { roomState } = useRoomState(vonageSession);

  React.useEffect(() => {
    const _subscribeToStream = ({ stream }) => subscribeToStream(stream);
    const _setConnections = () => {
      setConnections(
        vonageSession.session.connections.map(c => c).filter(connection => !connection.id.includes('.tokbox.com'))
      );
      setConnection(vonageSession.session.connection || {});
    };

    if (vonageSession) {
      vonageSession.on('streamCreated', _subscribeToStream);
      vonageSession.on('connectionCreated', _setConnections);
      vonageSession.on('connectionDestroyed', _setConnections);
      return () => {
        vonageSession.off('streamCreated', _subscribeToStream);
        vonageSession.off('connectionCreated', _setConnections);
        vonageSession.off('connectionDestroyed', _setConnections);
        //Should we?
        vonageSession.disconnect();
      };
    }
  }, [vonageSession]);

  // const _addPublisher = (publisher, type) => {
  //     let pub = {...publishers};
  //     pub[type][publisher.id] = publisher;
  //
  //     console.log('add-remove _addPublisher', publishers[type], publisher, pub[type])
  //     setPublishers(pub);
  // }
  //
  // const _removePublisher = (publisher, type) => {
  //     let pub = {...publishers};
  //     delete pub[type][publisher.id];
  //
  //     console.log('add-remove _removePublisher', publishers[type], publisher, pub[type])
  //     setPublishers(pub);
  // }
  //
  // const _addSubscriber = (subscriber, type) => {
  //
  //     subscriber.on('destroyed',_removeSubscriber)
  //
  //     let sub = {...subscribers};
  //     console.log('add-remove _addSubscriber', type, subscriber, sub)
  //     sub[type][subscriber.id] = subscriber;
  //
  //     setSubscribers(sub);
  // }
  //
  // const _removeSubscriber = (subscriber, type) => {
  //     let sub = {...subscribers};
  //     delete sub[type][subscriber.id];
  //
  //     console.log('add-remove _removeSubscriber', type, subscriber, sub)
  //     setSubscribers(sub);
  // }
  //
  // const publish = (publisher, type, _session = session) => {
  //     return new Promise((resolve, reject) => {
  //         _session.publish(publisher, error => {
  //             if (error) {
  //                 reject(error);
  //             } else {
  //                 _addPublisher(publisher, type);
  //                 resolve('ok')
  //             }
  //         });
  //     })
  // }
  //
  // const unpublish = (publisher, type) => {
  //     console.log('unpublish', type, publishers[type], publishers, publisher.id, publisher.stream, publisher)
  //     return new Promise((resolve, reject) => {
  //         debugger
  //         _removePublisher(publisher, type);
  //         session.unpublish(publisher);
  //         resolve('ok')
  //     });
  // }
  //
  // const subscribeToStream = useCallback(
  //     stream => {
  //         if (session) {
  //             console.log('subscribeToStream', stream.id, subscribers)
  //             let subscriber = session.subscribe(stream, initialVideoContainer, subscriberOptions, error => {
  //                 if (error) {
  //                     console.log('Subscription error', error);
  //                 } else {
  //                     _addSubscriber(subscriber, stream.videoType);
  //
  //                     subscriber.on('destroyed', () => {
  //                         console.log("subscriber.on('destroyed'");
  //                         _removeSubscriber(subscriber, stream.videoType)
  //                     })
  //                     console.log('Subscription success');
  //                 }
  //             });
  //         }
  //     }, [session, subscribers, screenSubscribers]);
  //
  // const disconnect = () => {
  //     if (session) {
  //         session.disconnect();
  //     }
  // }
  // const connect = async (roomName, name) => {
  //     let sessionData = await getSession(roomName);
  //     setSessionData(sessionData);
  //
  //     let token = await getToken(name, sessionData.roomName)
  //     let _session = window.OT.initSession(apiKey, sessionData.sessionId);
  //     setSession(_session);
  //
  //     return new Promise((resolve, reject) => {
  //         // if (isConnecting || isConnected) {
  //         //     console.log('otCore startCall() return');
  //         //     return;
  //         // }
  //
  //         setUserName(name);
  //
  //         console.log('otCore startCall() yeah', name);
  //         // setIsConnecting(true);
  //
  //         _session.connect(token, error => {
  //             if (error) {
  //                 // setIsConnecting(false);
  //                 reject(error.message);
  //             } else {
  //                 resolve(_session);
  //                 // startCall();
  //             }
  //         });
  //     })
  // }

  // let sessionMedia = React.useMemo(() => {
  //     let screenShareParticipant = null;
  //
  //     let screenPublishers = Object.values(publishers.screen);
  //     let cameraPublishers = Object.values(publishers.camera);
  //     let screenSubscribers = Object.values(subscribers.screen);
  //     let cameraSubscribers = Object.values(subscribers.camera);
  //
  //
  //     if (screenPublishers.length) {
  //         screenShareParticipant = {camera: cameraPublishers[0], screen: screenPublishers[0]};
  //     } else if (screenSubscribers.length > 0) {
  //         // Find the camera source of the screen sharing participant.
  //         let screen = screenSubscribers[0];
  //         let camera = cameraSubscribers.find(subscriber => subscriber.stream.connection.id === screen.stream.connection.id)
  //         screenShareParticipant = {camera, screen};
  //     } else {
  //         console.log('setScreenShareParticipant null;')
  //         screenShareParticipant = null;
  //     }
  //
  //     return {
  //         publishers: cameraPublishers,
  //         subscribers: cameraSubscribers,
  //         screenPublishers,
  //         screenSubscribers,
  //         screenShareParticipant,
  //         viewingSharedScreen: screenSubscribers.length,
  //         screenShareActive: screenSubscribers.length || screenPublishers.length
  //     }
  // }, [publishers, subscribers])

  return {
    // ...sessionMedia,
    // connection,
    // connections,
    // publish,
    // unpublish,
    // connect,
    // disconnect,
    session: vonageSession,
    roomState,
    // subscribeToStream,
    sessionData,
  };
}
