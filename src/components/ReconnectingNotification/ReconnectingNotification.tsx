import React from 'react';
import Snackbar from '../Snackbar/Snackbar';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

export default function ReconnectingNotification() {
  const { roomState } = useVideoContext();

  return (
    <Snackbar
      variant="error"
      headline="Connection Lost:"
      message="Reconnecting to room..."
      open={roomState === 'reconnecting'}
    />
  );
}
