import React, { useCallback } from 'react';
import useRoomState from '../hooks/useRoomState/useRoomState';
import { subscriberOptions } from './Config';

let apiKey = '47099484';

export default function useSession(sessionId) {
  const [session, setSession] = React.useState(null);
  const { roomState } = useRoomState(session);

  React.useEffect(() => {
    if (sessionId) {
      let session = window.OT.initSession(apiKey, sessionId);
      setSession(session);
    }
  }, [sessionId]);

  React.useEffect(() => {
    const _subscribeToStream = ({ stream }) => subscribeToStream(stream);
    if (session) {
      console.log('session on stream created');
      session.on('streamCreated', _subscribeToStream);
      return () => {
        session.off('streamCreated', _subscribeToStream);
      };
    }
  }, [session]);

  const subscribeToStream = useCallback(
    stream => {
      console.log('subscribeToStream', session, stream);
      if (session) {
        session.subscribe(stream, '#hiddenVideoContainer', subscriberOptions, error => {
          if (error) {
            console.log('Subscription error', error);
          } else {
            console.log('Subscription success');
          }
        });
      }
    },
    [session]
  );

  return { session, roomState, subscribeToStream };
}
