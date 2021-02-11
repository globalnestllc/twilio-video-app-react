import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';
import React from 'react';
import useMainParticipant from '../../hooks/useMainParticipant/useMainParticipant';
import VideoTrack from '../../vonage/VideoTrack';

export default function MainParticipant() {
  const mainParticipant = useMainParticipant();
  // const {
  //   room: { localParticipant },
  // } = useVideoContext();
  // const [selectedParticipant] = useSelectedParticipant();
  // const screenShareParticipant = useScreenShareParticipant();
  //
  // const videoPriority =
  //   (mainParticipant === selectedParticipant || mainParticipant === screenShareParticipant) &&
  //   mainParticipant !== localParticipant
  //     ? 'high'
  //     : null;

  if (!mainParticipant) {
    return null;
  }

  return (
    /* audio is disabled for this participant component because this participant's audio
       is already being rendered in the <ParticipantStrip /> component.  */
    <MainParticipantInfo participant={mainParticipant}>
      <VideoTrack publisher={mainParticipant} />
      {/*<ParticipantTracks*/}
      {/*  participant={mainParticipant}*/}
      {/*  videoOnly*/}
      {/*  enableScreenShare={mainParticipant !== localParticipant}*/}
      {/*  videoPriority={videoPriority}*/}
      {/*  isLocalParticipant={mainParticipant === localParticipant}*/}
      {/*/>*/}
    </MainParticipantInfo>
  );
}
