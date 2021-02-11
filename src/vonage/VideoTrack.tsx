import React, { useEffect, useRef } from 'react';
// import { IVideoTrack } from '../../types';
import { styled } from '@material-ui/core/styles';
import { Track } from 'twilio-video';
import { Participant } from './types';
import { useAppState } from '../state';
// import useMediaStreamTrack from '../../hooks/useMediaStreamTrack/useMediaStreamTrack';
// import useVideoTrackDimensions from '../../hooks/useVideoTrackDimensions/useVideoTrackDimensions';

const Video = styled('div')({
  width: '100%',
  height: '100%',
});

interface VideoTrackProps {
  publisher: Participant;
  isLocal?: boolean;
  isSelected?: boolean;
  priority?: Track.Priority | null;
}

export default function VideoTrack({ publisher, isSelected }: VideoTrackProps) {
  const ref = useRef<HTMLDivElement>(null!);
  const { activeSinkId } = useAppState();

  useEffect(() => {
    // @ts-ignore
    publisher?.videoElement()?.setSinkId(activeSinkId);
  }, [activeSinkId]);

  useEffect(() => {
    const el = ref.current;
    let videoEl = publisher.element;
    //Remove all children.
    let child;
    while ((child = el.firstChild)) {
      child.remove();
    }

    if (isSelected) {
      // @ts-ignore
      let videoTrack = publisher.videoElement().srcObject.getVideoTracks()[0];
      let ms = new MediaStream();
      // @ts-ignore
      ms.addTrack(videoTrack);
      videoEl = document.createElement('video');
      // @ts-ignore
      videoEl.srcObject = ms;
      videoEl.setAttribute('playsinline', 'true');
      videoEl.setAttribute('autoplay', 'true');
      videoEl.setAttribute('style', 'width:100%;height:100%');
    }
    el.append(videoEl);

    return () => {
      if (videoEl) {
        // videoEl.remove()
      }
    };
  }, [publisher, publisher.element, isSelected]);

  return <Video ref={ref} />;
}
