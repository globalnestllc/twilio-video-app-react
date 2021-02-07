import React from 'react';

import Button from '@material-ui/core/Button';
import MicIcon from '../../../icons/MicIcon';
import MicOffIcon from '../../../icons/MicOffIcon';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export default function ToggleAudioButton(props: { disabled?: boolean; className?: string }) {
  const { isAudioEnabled, toggleAudioEnabled, localParticipant } = useVideoContext();

  // When it's not published the stream property is null.
  // const hasAudioTrack = localParticipant?.stream?.hasAudio;
  const hasAudioTrack = localParticipant;
  console.log('hasAudioTrack', localParticipant);

  return (
    <Button
      className={props.className}
      onClick={toggleAudioEnabled}
      disabled={!hasAudioTrack || props.disabled}
      startIcon={isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
      data-cy-audio-toggle
    >
      {!hasAudioTrack ? 'No Audio' : isAudioEnabled ? 'Mute' : 'Unmute'}
    </Button>
  );
}
