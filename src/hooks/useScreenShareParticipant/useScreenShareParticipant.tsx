import { useEffect, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

import { TrackPublication } from 'twilio-video';
import { Participant } from '../../vonage/types';

/*
  Returns the participant that is sharing their screen (if any). This hook assumes that only one participant
  can share their screen at a time.
*/
export default function useScreenShareParticipant() {
  const { room } = useVideoContext();
  const [screenShareParticipant, setScreenShareParticipant] = useState<Participant>();

  useEffect(() => {}, [room]);

  return screenShareParticipant;
}
