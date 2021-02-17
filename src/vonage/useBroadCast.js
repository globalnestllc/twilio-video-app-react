import React from 'react';

export default function useBroadCast(vonageSession) {
  const [broadcast, setBroadcast] = React.useState(false);
  const [broadcastLayout, setBroadcastLayout] = React.useState('bestFit');

  function startBroadCast() {
    setBroadcast(true);
  }
  function stopBroadcast() {
    setBroadcast(false);
  }
  function changeBroadCastLayout(type) {
    setBroadcastLayout(type);
  }
  return {
    broadcast,
    broadcastLayout,
    startBroadCast,
    stopBroadcast,
    changeBroadCastLayout,
  };
}
