import React from 'react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import VideoTrack from '../../vonage/VideoTrack';
import { Participant as IParticipant } from '../../vonage/types';

interface ParticipantProps {
  participant: IParticipant;
  videoOnly?: boolean;
  enableScreenShare?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  isDominantSpeaker?: boolean;
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
}

export default function Participant({
  participant,
  onClick,
  isSelected,
  isLocalParticipant,
  hideParticipant,
}: ParticipantProps) {
  return (
    <ParticipantInfo
      participant={participant}
      onClick={onClick}
      isSelected={isSelected}
      isLocalParticipant={isLocalParticipant}
      hideParticipant={hideParticipant}
    >
      <VideoTrack publisher={participant} isSelected={isSelected} />
    </ParticipantInfo>
  );
}
