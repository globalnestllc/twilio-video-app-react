import { useEffect, useState } from 'react';

type RoomStateType = 'disconnected' | 'connected' | 'reconnecting';

export default function useRoomState(session) {
  const [roomState, setState] = useState<RoomStateType>('disconnected');

  useEffect(() => {
    const setRoomState = (state = 'disconnected', event) => {
      console.log('session Set room state', state, event);
      return setState(state as RoomStateType);
    };

    if (session) {
      const setConnected = e => setRoomState('connected', e);
      const setDisconnected = e => setRoomState('disconnected', e);
      const setReconnecting = e => setRoomState('reconnecting', e);
      const setReconnected = e => setRoomState('connected', e);

      console.log('session Set room state register');
      session.on('sessionConnected', setConnected);
      session.on('sessionDisconnected', setDisconnected);
      session.on('sessionReconnected', setReconnected);
      session.on('sessionReconnecting', setReconnecting);
      return () => {
        console.log('session Set room state Un-register');
        session.off('sessionConnected', setConnected);
        session.off('sessionDisconnected', setDisconnected);
        session.off('sessionReconnected', setReconnected);
        session.off('sessionReconnecting', setReconnecting);
      };
    }
  }, [session]);

  return roomState;
}
