import AccCore from 'opentok-accelerator-core';
import config from './config.json';
import React from 'react';

const otCoreOptions = {
  credentials: {
    apiKey: config.apiKey,
    sessionId: config.sessionId,
    token: config.token,
  },
  // A container can either be a query selector or an HTML Element
  streamContainers(pubSub, type, data, stream) {
    return '#hiddenVideoContainer';
  },
  controlsContainer: 'body',
  packages: ['textChat', 'screenSharing', 'annotation'],
  communication: {
    callProperties: {
      showControls: false,
      nameDisplayMode: 'off',
    }, // Using default
    autoSubscribe: true,
  },
  textChat: {
    name: ['David', 'Paul', 'Emma', 'George', 'Amanda'][(Math.random() * 5) | 0], // eslint-disable-line no-bitwise
    waitingMessage: 'Messages will be delivered when other users arrive',
    container: '#chat',
  },
  screenSharing: {
    extensionID: 'plocfffmbcclpdifaikiikgplfnepkpo',
    annotation: true,
    externalWindow: false,
    dev: true,
    screenProperties: {
      appendControl: false,
      insertMode: 'none',
      width: '100%',
      height: '100%',
      showControls: true,
      style: {
        buttonDisplayMode: 'off',
      },
      videoSource: 'window',
      fitMode: 'contain', // Using default
    },
  },
  annotation: {
    absoluteParent: {
      publisher: '.App-video-container',
      subscriber: '.App-video-container',
    },
  },
};

export default function getOtCore(sessionId, token, name) {
  if (sessionId) {
    otCoreOptions.credentials.sessionId = sessionId;
  }
  if (token) {
    otCoreOptions.credentials.token = token;
  }
  otCoreOptions.name = name;

  let otCore = new AccCore(otCoreOptions);
  console.log('new otcore', otCore);
  window.otCore1 = otCore;
  return otCore;
}

export function useOtCore(sessionId, token) {
  const [otCore, setOtCore] = React.useState(null);
  React.useEffect(() => {
    if (sessionId) {
      otCoreOptions.credentials.sessionId = sessionId;
    }
    if (token) {
      otCoreOptions.credentials.token = token;
    }

    let otCore = new AccCore(otCoreOptions);
    setOtCore(otCore);

    return () => {};
  }, [sessionId, token]);

  if (sessionId) {
  }

  window.otCore = otCore;
  return otCore;
}
