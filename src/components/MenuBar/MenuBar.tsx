import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import ToggleFullscreenButton from '../ToggleFullScreenButton/ToggleFullScreenButton';
import Toolbar from '@material-ui/core/Toolbar';

import { useParams } from 'react-router-dom';
import { useAppState } from '../../state';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import 'moment-timezone';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import * as ApiServices from '../../Api/ApiServices';
// import {joinVideoChannel} from "../../../../../store/actions/video";
import useParticipantDisplayName from '../../hooks/useParticipantDisplayName/useParticipantDisplayName';
import Menu from './Menu/Menu';
import useCountdown from './useCountdown';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
    },
    form: {
      display: 'flex',
      alignItems: 'center',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    textFieldnone: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
      display: 'none',
    },
    loadingSpinner: {
      marginLeft: '1em',
    },
    displayName: {
      marginLeft: '2.2em',
      minWidth: '200px',
      fontWeight: 600,
    },
    marginL20: {
      marginLeft: '200px',
    },
    meetingOver: {
      marginLeft: '150px',
      color: 'red!important;',
      fontWeight: 'bold',
      background: 'transparent!important;',
    },
  })
);

type VideoMode = 'free' | 'session';
export default function MenuBar(props) {
  const classes = useStyles();
  const {
    URLRoomName: _roomName,
    uName: _userName,
    eName: _eventName,
    vType: _videoType,
    recording,
    end,
    zone,
    base,
  } = useParams();

  const { onCloseVideo, callee, callerId = 'empty-caller-id', mode = 'free' } = props;

  console.log('MENUBAR:', _roomName, _userName, _eventName, _videoType, recording, end, zone, base);

  const { user, displayName, getToken, setUserName, isFetching, showToast } = useAppState();
  const { isConnecting, connect, room, localTracks } = useVideoContext();
  const roomState = useRoomState();

  const [roomName, setRoomName] = useState<string>('');
  const [eventName, setEventmName] = useState<string>('');
  const [videoType, setVideoType] = useState<string>('');
  const [recordingType, setRecordingType] = useState<string>('');
  //Timer Code

  const [joinButtonEnabled, setJoinButtonEnabled] = useState('true');
  const [msg, setMsg] = useState<string>('Meeting is over');
  const [uniqueUserName, setUniqueUserName] = useState<string>('');

  const timerCallback = (reason: string) => {
    switch (reason) {
      case 'complete':
        if (roomState === 'connected') {
          room.disconnect();
          setJoinButtonEnabled('false');
          setMsg('MEETING IS OVER');
          window.close();
        }
        break;
      case 'last-2-minutes':
        showToast('error', 'Last 2 minutes...');
        break;
    }
  };
  const { second, minute, timezone, remainingSeconds } = useCountdown(end, zone, timerCallback);

  const { getUniqueName } = useParticipantDisplayName(null);
  if (user?.displayName && displayName === '') {
    setUserName(user.displayName);
  }

  useEffect(() => {
    /* This is a workaround to be able to have users use the same name in the video call.
        #Local
        - Prefix callerId (email) to the user's selected display name.
        - Use this value on token request as the ParticipantID
        - Then remove the prefix on the UI.

        #Remote
        - Twilio passes the identity provided in token request to all participants.
        - So, we need to remove the prefix from the remote Participant names as well.
        - To remove/modify a participant in the room
     */

    setUniqueUserName(getUniqueName(callerId, displayName));
  }, [displayName]);

  useEffect(() => {
    if (_roomName) {
      setRoomName(_roomName);
    }
    if (_userName && displayName === '') {
      setUserName(_userName);
    }

    if (_eventName) {
      setEventmName(_eventName);
    }
    if (_videoType) {
      setVideoType(_videoType);
    }
    if (recording) {
      setRecordingType(recording);
    }
    //
    // let timerID = setInterval(() => tick(), 1000);
    //
    // return () => clearInterval(timerID);
  }, [_roomName, _userName, _eventName, _videoType, recording, second, minute, end]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If this app is deployed as a twilio function, don't change the URL beacuse routing isn't supported.
    if (!window.location.origin.includes('twil.io')) {
      // window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}`));
    }
    if (mode === 'free') {
      console.log('getToken:', uniqueUserName, roomName, videoType, recordingType);
      getToken(uniqueUserName, roomName, videoType, recordingType)
        .then(token => connect(token))
        .catch(error => {
          console.error('Could not fetch the video token');
        });
      // dispatch(joinVideoChannel(roomName, callee));
    } else {
      let url = 'https://' + base + '.force.com/services/apexrest/BLN_ASC_MM_ScheduleStatus';
      ApiServices.getScheduleStatus(url, roomName).then(response => {
        let data = response.data;
        const currentTime = new Date(moment.tz(new Date(), timezone).format('MM/DD/YYYY LT'));
        if (data.aptStatus.toLowerCase() == 'cancelled') {
          setMsg('Meeting is cancelled');
          setJoinButtonEnabled('false');
        } else if (currentTime.getTime() < new Date(data.starttime.replace(/-/g, '/')).getTime()) {
          setMsg('Meeting has not started.');
          setJoinButtonEnabled('false');
        } else {
          getToken(uniqueUserName, roomName, videoType, recordingType).then(token => connect(token));
        }
      });
    }
  };

  const handleClose = () => {
    room.disconnect?.();
    localTracks.forEach(track => track.stop());
    // setIsOpen(false);
    onCloseVideo();
  };

  return (
    <AppBar className={classes.container} position="static">
      <Toolbar>
        {roomState === 'disconnected' ? (
          <form className={classes.form} onSubmit={handleSubmit}>
            {!user?.displayName ? (
              <TextField
                id="menu-name"
                label="Name"
                className={classes.textField}
                value={displayName}
                onChange={handleNameChange}
                margin="dense"
              />
            ) : (
              <Typography className={classes.displayName} variant="body1">
                {displayName}
              </Typography>
            )}
            <TextField
              id="menu-room"
              label="Room"
              className={classes.textFieldnone}
              value={roomName}
              onChange={handleRoomNameChange}
              margin="dense"
            />
            {joinButtonEnabled == 'true' ? (
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={isConnecting || !displayName || !roomName || isFetching}
              >
                Join Room
              </Button>
            ) : (
              <Button type="submit" color="primary" variant="contained" className={classes.meetingOver} disabled>
                {msg}
              </Button>
            )}
            {(isConnecting || isFetching) && <CircularProgress className={classes.loadingSpinner} />}
          </form>
        ) : (
          <h3>
            {_userName} <span className={classes.marginL20}> </span>
            Time left : {minute}:{second < 10 ? `0${second}` : second}
          </h3>
        )}
        <ToggleFullscreenButton />
        {/*<IconButton aria-label="close" onClick={handleClose}>*/}
        {/*  <CloseIcon/>*/}
        {/*</IconButton>*/}
        <Menu />
      </Toolbar>
    </AppBar>
  );
}
