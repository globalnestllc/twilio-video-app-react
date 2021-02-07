import React, { useState } from 'react';
import { Participant } from './types';
import { SELECTED_AUDIO_INPUT_KEY, SELECTED_VIDEO_INPUT_KEY } from '../constants';

/*
 * This hook allows components to reliably use the 'mediaStreamTrack' property of
 * an AudioTrack or a VideoTrack. Whenever 'localTrack.restart(...)' is called, it
 * will replace the mediaStreamTrack property of the localTrack, but the localTrack
 * object will stay the same. Therefore this hook is needed in order for components
 * to rerender in response to the mediaStreamTrack changing.
 */
export default function useMediaStreamTrack(participant: Participant, trackType: 'video' | 'audio') {
  const [mediaStreamTrack, setMediaStreamTrack] = useState(getSource());
  const localDeviceId = mediaStreamTrack?.getSettings().deviceId;

  function getSource() {
    switch (trackType) {
      case 'audio':
        return participant?.getAudioSource();
      case 'video':
        return participant?.getVideoSource()?.track;
      default:
        console.warn('Device type is not recognized!, using video.');
        return participant?.getVideoSource()?.track;
    }
  }

  function setSource(source) {
    switch (trackType) {
      case 'audio':
        window.localStorage.setItem(SELECTED_AUDIO_INPUT_KEY, source);
        return participant?.setAudioSource(source);
      case 'video':
        window.localStorage.setItem(SELECTED_VIDEO_INPUT_KEY, source);
        return participant?.setVideoSource(source);
      default:
        console.warn('Device type is not recognized!, using video.');
        window.localStorage.setItem(SELECTED_VIDEO_INPUT_KEY, source);
        return participant?.setVideoSource(source);
    }
  }

  React.useEffect(() => {
    if (participant) {
      setMediaStreamTrack(getSource());
    }
  }, [participant]);

  function replaceTrack(newDeviceId: string) {
    setSource(newDeviceId).then(r => {
      setMediaStreamTrack(getSource());
    });
  }

  return { mediaStreamTrack, localDeviceId, replaceTrack };
}
