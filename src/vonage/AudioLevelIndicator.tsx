import React, { useEffect, useRef } from 'react';
import useMediaStreamTrack from './useMediaStreamTrack';

let clipId = 0;
const getUniqueClipId = () => clipId++;

function AudioLevelIndicator({ participant, color = 'white' }) {
  const SVGRectRef = useRef<SVGRectElement>(null);
  const { mediaStreamTrack } = useMediaStreamTrack(participant, 'audio');
  const [audioLevel, setAudioLevel] = React.useState(0);

  useEffect(() => {
    if (mediaStreamTrack) {
      // Here we create a new MediaStream from a clone of the mediaStreamTrack.
      // A clone is created to allow multiple instances of this component for a single
      // AudioTrack on iOS Safari.
      let newMediaStream = new MediaStream([mediaStreamTrack.clone()]);

      // Here we listen for the 'stopped' event on the audioTrack. When the audioTrack is stopped,
      // we stop the cloned track that is stored in 'newMediaStream'. It is important that we stop
      // all tracks when they are not in use. Browsers like Firefox don't let you create a new stream
      // from a new audio device while the active audio device still has active tracks.

      return () => {
        newMediaStream.getTracks().forEach(track => track.stop());
      };
    }
  }, [mediaStreamTrack]);

  useEffect(() => {
    if (participant) {
      let movingAvg = null;
      let _setAudioLevel = event => {
        if (movingAvg === null || movingAvg <= event.audioLevel) {
          movingAvg = event.audioLevel;
        } else {
          movingAvg = 0.7 * movingAvg + 0.3 * event.audioLevel;
        }

        // 1.5 scaling to map the -30 - 0 dBm range to [0,1]
        let logLevel = Math.log(movingAvg) / Math.LN10 / 1.5 + 1;
        logLevel = Math.min(Math.max(logLevel, 0), 1);
        logLevel = 14 - 14 * logLevel;
        setAudioLevel(logLevel);
      };
      participant.on('audioLevelUpdated', _setAudioLevel);
      return () => {
        participant.off('audioLevelUpdated', _setAudioLevel);
      };
    }
  }, [participant]);

  // Each instance of this component will need a unique HTML ID
  const clipPathId = `audio-level-clip-${getUniqueClipId()}`;

  return mediaStreamTrack ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" data-test-audio-indicator>
      <defs>
        <clipPath id={clipPathId}>
          <rect ref={SVGRectRef} x="0" y={audioLevel} width="24" height="24" />
        </clipPath>
      </defs>
      <g fill="none" fillRule="evenodd" transform="translate(.5)">
        <rect
          clipPath={`url(#${clipPathId})`}
          width="5.2"
          height="10"
          x="9.5"
          y="3.5"
          rx="6"
          ry="3"
          fill="#23BF6E"
        ></rect>
        <path
          fill={color}
          strokeWidth="0"
          d="M17.389 10.667c.276 0 .5.224.5.5 0 3.114-2.396 5.67-5.445 5.923v2.632c0 .276-.223.5-.5.5-.245 0-.45-.177-.491-.41l-.009-.09V17.09C8.395 16.836 6 14.281 6 11.167c0-.276.224-.5.5-.5s.5.224.5.5c0 2.73 2.214 4.944 4.944 4.944 2.731 0 4.945-2.214 4.945-4.944 0-.276.224-.5.5-.5zM11.944 4c1.566 0 2.834 1.268 2.834 2.833v4.334c0 1.564-1.268 2.833-2.834 2.833-1.564 0-2.833-1.27-2.833-2.833V6.833C9.111 5.268 10.38 4 11.944 4zm0 1c-1.012 0-1.833.82-1.833 1.833v4.334c0 1.012.822 1.833 1.833 1.833 1.013 0 1.834-.82 1.834-1.833V6.833c0-1.013-.82-1.833-1.834-1.833z"
        />
      </g>
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      transform="translate(-0.5, 0)"
      data-test-audio-mute-icon
    >
      <g fill="none" fillRule="evenodd">
        <path
          fill={color}
          strokeWidth="0"
          d="M11.889 6.667c.276 0 .5.224.5.5 0 3.114-2.396 5.67-5.445 5.923v2.632c0 .276-.223.5-.5.5-.245 0-.45-.177-.491-.41l-.009-.09V13.09c-1.116-.093-2.145-.494-3-1.119l.717-.717c.793.54 1.751.857 2.783.857 2.731 0 4.945-2.214 4.945-4.944 0-.276.224-.5.5-.5zM1 6.667c.276 0 .5.224.5.5 0 .975.282 1.884.77 2.65l-.722.721C.888 9.58.5 8.418.5 7.167c0-.276.224-.5.5-.5zm8.277-1.031v1.53C9.278 8.732 8.01 10 6.445 10c-.446 0-.868-.103-1.243-.287l.776-.773c.149.039.306.06.467.06.963 0 1.751-.74 1.828-1.683l.006-.15v-.531l1-1zM6.444 0C8.01 0 9.278 1.268 9.278 2.833l-.002-.025-.999.999v-.974c0-.962-.74-1.75-1.682-1.827L6.445 1c-.962 0-1.751.74-1.828 1.683l-.006.15v4.334c0 .097.008.192.022.285l-.804.805c-.112-.269-.184-.558-.209-.86l-.009-.23V2.833C3.611 1.268 4.88 0 6.444 0z"
          transform="translate(6.5 4)"
        />
        <path
          fill="red"
          strokeWidth="0"
          d="M12.146.646c.196-.195.512-.195.708 0 .173.174.192.443.057.638l-.057.07-12 12c-.196.195-.512.195-.708 0-.173-.174-.192-.443-.057-.638l.057-.07 12-12z"
          transform="translate(6.5 4)"
        />
      </g>
    </svg>
  );
}

export default React.memo(AudioLevelIndicator);
