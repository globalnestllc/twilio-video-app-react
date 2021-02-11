import useVideoContext from '../useVideoContext/useVideoContext';
import useSelectedParticipant from '../../components/VideoProvider/useSelectedParticipant/useSelectedParticipant';

export default function useMainParticipant() {
  const { selectedParticipant } = useSelectedParticipant();
  // const screenShareParticipant = useScreenShareParticipant();
  // const dominantSpeaker = useDominantSpeaker();
  const { publishers, subscribers, viewingSharedScreen, screenShareParticipant } = useVideoContext();
  const participants = [...publishers, ...subscribers];
  const localParticipant = publishers?.[0];

  // const remoteScreenShareParticipant = screenShareParticipant !== localParticipant ? screenShareParticipant : null;

  // The participant that is returned is displayed in the main video area. Changing the order of the following
  // variables will change the how the main speaker is determined.
  // return selectedParticipant || remoteScreenShareParticipant || dominantSpeaker || participants[0] || localParticipant;

  let remoteScreenShareParticipant = viewingSharedScreen && screenShareParticipant?.screen;

  return selectedParticipant || remoteScreenShareParticipant || subscribers?.[0] || localParticipant;
}
