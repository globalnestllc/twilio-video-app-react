import React, { FormEvent, useEffect, useState } from 'react';
import useRoomState from '../hooks/useRoomState/useRoomState';
import useVideoContext from '../hooks/useVideoContext/useVideoContext';
import HeaderContent from './HeaderContent';
// import {toast} from "react-toastify";

export default function useMenuBar(props, isConnected) {
  const { onCloseVideo, admin = false } = props;

  // const videoParams = new VideoCallParameters(props);
  const { roomState } = useVideoContext();

  // const {user, displayName, getToken, setUserName} = useAppState();
  const { connect } = useVideoContext();

  const [joinButtonEnabled, setJoinButtonEnabled] = useState(true);
  const [headerMessage, setHeaderMessage] = useState<string>();
  const [uniqueUserName, setUniqueUserName] = useState<string>('');

  // if (user?.displayName && displayName === '') {
  //     setUserName(user.displayName);
  // }

  const timerCallback = reason => {
    switch (reason) {
      // case 'complete':
      // if (roomState === 'connected') {
      //     setJoinButtonEnabled(false);
      //     setHeaderMessage('Meeting is over!');
      //     onCloseVideo()
      //     window.close();
      // }
      // break;
      // case 'last-2-minutes':
      //     toast.error('Last 2 minutes...', {
      //         position: "bottom-center",
      //         autoClose: 15000,
      //         toastId: 'last-2-mins'
      //     });
      //     break;
      case 'started':
        //TODO: call onSubmit
        // _startVideoCall();
        break;
    }
  };
  // const {timeToStart, timeToEnd} = useCountdown(videoParams.timeBound.start, videoParams.timeBound.end, timerCallback);

  // useEffect(() => {
  //     if (timeToStart) {
  //         let meetingStarted = (timeToStart.remainingSeconds || 0)<=0;
  //
  //         setJoinButtonEnabled(meetingStarted);
  //     }
  // }, [timeToStart])

  // useEffect(() => {
  //     /* This is a workaround to be able to have users use the same name in the video call.
  //         #Local
  //         - Prefix callerId (email) to the user's selected display name.
  //         - Use this value on token request as the ParticipantID
  //         - Then remove the prefix on the UI.
  //
  //         #Remote
  //         - Twilio passes the identity provided in token request to all participants.
  //         - So, we need to remove the prefix from the remote Participant names as well.
  //         - To remove/modify a participant in the room
  //      */
  //
  //     setUniqueUserName(displayName);
  // }, [displayName]);

  // useEffect(() => {
  //     if (videoParams.user.name && displayName === '') {
  //         setUserName(videoParams.user.name);
  //     }
  //
  // }, [videoParams.user.name]);

  // const _startVideoCall = () => {
  //     // getToken(uniqueUserName, videoParams.room.name, videoParams.room.type, videoParams.room.recording)
  //     getToken(uniqueUserName, videoParams.room.name, videoParams.serialize())
  //         .then(token => connect(token))
  //         .catch(error => {
  //
  //             console.error('Could not fetch the video token');
  //         });
  // }
  // const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
  //     if (!window.location.origin.includes('twil.io')) {
  //         // window.history.replaceState(null, '', window.encodeURI(`/room/${params.room.name}${window.location.search || ''}`));
  //     }
  //
  //     switch (videoParams.mode) {
  //         case 'free':
  //             _startVideoCall();
  //             break;
  //         case 'test':
  //             _startVideoCall();
  //             break;
  //         case 'session':
  //             getScheduleStatus(videoParams.room.name).then(response => {
  //                 let data = response.data;
  //                 if (data.aptStatus && data.aptStatus.toLowerCase() === 'cancelled') {
  //                     setHeaderMessage('Meeting is cancelled');
  //                     setJoinButtonEnabled(false);
  //                     // We're handling not started case using countDown timer.
  //                 } else {
  //                     _startVideoCall();
  //                 }
  //             });
  //             break;
  //         default:
  //             _startVideoCall();
  //             break;
  //     }
  // };

  const handleClose = async () => {
    let message = admin
      ? "You're the admin of this video call. If you leave, the call will be closed and all participants will drop."
      : "You're going to leave the call.";
    // @ts-ignore
    const approved = await dialogBoxService.showConfirmation(message);

    if (approved) {
      onCloseVideo();
    }
  };

  // const setName = (name) => setUserName(name)

  return {
    // setName,
    // displayName,
    joinButtonEnabled,
    headerMessage,
    // roomName: videoParams.room.name,

    handleClose,
    // handleSubmit,

    HeaderContent: (
      <HeaderContent
        connected={isConnected}
        // videoParams={videoParams}
        // timeToStart={timeToStart}
        // timeToEnd={timeToEnd}
        message={headerMessage}
      />
    ),
  };
}
