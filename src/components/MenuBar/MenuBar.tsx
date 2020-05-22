import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import ToggleFullscreenButton from '../ToggleFullScreenButton/ToggleFullScreenButton';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from './Menu/Menu';

import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Typography } from '@material-ui/core';
import moment from 'moment';
import 'moment-timezone';

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

export default function MenuBar() {
  const classes = useStyles();
  const { URLRoomName } = useParams();
  const { uName } = useParams();
  const { eName } = useParams();
  const { vType } = useParams();
  const { recording } = useParams();
  const { end } = useParams();
  const { zone } = useParams();
  const { base } = useParams();
  const { user, displayName, getToken, setUserName, isFetching } = useAppState();
  const { isConnecting, connect } = useVideoContext();
  const roomState = useRoomState();

  if (user?.displayName && displayName === '') {
    setUserName(user.displayName);
  }
  const [roomName, setRoomName] = useState<string>('');
  const [eventName, setEventmName] = useState<string>('');
  const [videoType, setVideoType] = useState<string>('');
  const [recordingType, setRecordingType] = useState<string>('');
  //Timer Code

  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(0);
  const [calldis, setCallDis] = useState<string>('false');
  const [endTime, setEndTime] = useState<string>('');
  const [timezone, setTimeZone] = useState('');
  const [enable, setEnable] = useState('true');
  const [msg, setMsg] = useState<string>('Meeting is over');
  const { room } = useVideoContext();

  const tick = () => {
    const currentTime = moment.tz(new Date(), timezone).format('MM/DD/YYYY LT');
    console.log(endTime + ' | ' + currentTime);
    console.log(new Date(currentTime) > new Date(endTime));
    if (second > 0) {
      setSecond(second => second - 1);
    }

    if (second === 0) {
      if (minute === 0) {
        // console.log("sec : "+second+"  | Min : "+minute);
        if (roomState === 'connected') {
          room.disconnect();
          setEnable('false');
          // window.close();
        }
        if (new Date(currentTime) > new Date(endTime)) {
          console.log('Came h e r e.. ');
          // room.disconnect();
          //window.close();
        }
      } else {
        setMinute(minute => minute - 1);
        setSecond(59);
      }
    }
  };

  useEffect(() => {
    if (URLRoomName) {
      setRoomName(URLRoomName);
    }
    if (uName && displayName === '') {
      setUserName(uName);
    }
    if (eName) {
      setEventmName(eName);
    }
    if (vType) {
      setVideoType(vType);
    }
    if (recording) {
      setRecordingType(recording);
    }
    if (end && zone) {
      setEndTime(end.replace(/-/g, '/'));
      setTimeZone(zone.replace(/-/g, '/'));
      if (endTime != '' && timezone != '' && calldis == 'false') {
        setCallDis('true');
        //console.log("Came here for end time 11:"+endTime+"  | zone: "+ timezone);
        const currentTime = new Date(moment.tz(new Date(), timezone).format('MM/DD/YYYY LTS'));
        if (currentTime.getTime() < new Date(endTime).getTime()) {
          let diff = (new Date(endTime).getTime() - currentTime.getTime()) / 1000;
          setMinute(Math.abs(Math.floor(diff / 60)));
          setSecond(Math.abs(diff % 60));
        } else {
          setMsg('MEETING IS OVER');
          setEnable('false');
        }
      }
    }
    let timerID = setInterval(() => tick(), 1000);

    return () => clearInterval(timerID);
  }, [URLRoomName, uName, eName, vType, recording, second, minute, end, endTime]);

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
      window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}`));
    }
    const headers = new window.Headers();
    const b = base;
    let url = 'https://' + base + '.force.com';
    url = url + '/services/apexrest/BLN_ASC_MM_ScheduleStatus?meetingid=' + roomName;
    console.log(url);
    fetch(url, { headers })
      .then(res => res.json())
      .then(data => {
        // console.log("Data",data);
        const currentTime = new Date(moment.tz(new Date(), timezone).format('MM/DD/YYYY LT'));
        if (data.aptStatus.toLowerCase() == 'cancelled') {
          setMsg('Meeting is cancelled');
          setEnable('false');
        } else if (currentTime.getTime() < new Date(data.starttime.replace(/-/g, '/')).getTime()) {
          setMsg('Meeting has not started.');
          setEnable('false');
        } else {
          getToken(displayName, roomName, videoType, recordingType).then(token => connect(token));
        }
      });
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
                {user.displayName}
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
            {enable == 'true' ? (
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
            {eventName} <span className={classes.marginL20}> </span>Time left : {minute}:
            {second < 10 ? `0${second}` : second}
          </h3>
        )}
        <ToggleFullscreenButton />
        {/* <Menu /> */}
      </Toolbar>
    </AppBar>
  );
}
