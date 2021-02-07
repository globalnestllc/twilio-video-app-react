import React from 'react';
import { Button, Grid, Hidden, makeStyles, Theme, Typography } from '@material-ui/core';
import LocalVideoPreview from './LocalVideoPreview/LocalVideoPreview';
import SettingsMenu from './SettingsMenu/SettingsMenu';
import { Steps } from '../PreJoinScreens';
import ToggleAudioButton from '../../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../../Buttons/ToggleVideoButton/ToggleVideoButton';
import { useAppState } from '../../../state';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { useParams } from 'react-router-dom';
import * as ApiServices from '../../../Api/ApiServices';
import moment from 'moment';
import { TwilioError } from 'twilio-video';
import NetworkTest, { ErrorNames } from 'opentok-network-test-js';
import useNetworkTest from '../../../vonage/useNetworkTest';

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  marginTop: {
    marginTop: '1em',
  },
  deviceButton: {
    width: '100%',
    border: '2px solid #aaa',
    margin: '1em 0',
  },
  localPreviewContainer: {
    paddingRight: '2em',
    [theme.breakpoints.down('sm')]: {
      padding: '0 2.5em',
    },
  },
  joinButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
      width: '100%',
      '& button': {
        margin: '0.5em 0',
      },
    },
  },
  mobileButtonBar: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '1.5em 0 1em',
    },
  },
  mobileButton: {
    padding: '0.8em 0',
    margin: 0,
  },
}));

interface DeviceSelectionScreenProps {
  name: string;
  roomName: string;
  setStep: (step: Steps) => void;
}

export default function DeviceSelectionScreen({ name, roomName, setStep }: DeviceSelectionScreenProps) {
  const classes = useStyles();
  const { getToken, isFetching, setError } = useAppState();
  const { connect, isAcquiringLocalTracks, isConnecting } = useVideoContext();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;
  console.log('isConnecting', isConnecting);
  // const {} = useNetworkTest(name);

  const { vType: _videoType, recording = false, zone, base } = useParams();

  const handleJoin = () => {
    if (base) {
      let url = 'https://' + base + '.force.com/services/apexrest/BLN_ASC_MM_ScheduleStatus';
      ApiServices.getScheduleStatus(url, roomName).then(data => {
        if (!data.aptStatus || !data.starttime) {
          setError(new Error('Meeting not found') as TwilioError);
          return;
        }

        let timezone = zone.replace(/-/g, '/');
        const currentTime = new Date(moment.tz(new Date(), timezone).format('MM/DD/YYYY LT'));

        if (data.aptStatus.toLowerCase() == 'cancelled') {
          setError(new Error('Meeting is cancelled') as TwilioError);
        } else if (currentTime.getTime() < new Date(data.starttime.replace(/-/g, '/')).getTime()) {
          setError(new Error('Meeting has not started yet.') as TwilioError);
        } else {
          connect(roomName, name)
            .then(r => console.log('Connected to room'))
            .catch(err => console.log('Error connecting room', err));
          // getToken(name, roomName, _videoType, recording)
          //     .then(token => connect(token,name))
          //     .catch(error => console.log('Error fetching token: ', error));
        }
      });
    } else {
      connect(roomName, name)
        .then(r => console.log('Connected to room'))
        .catch(err => console.log('Error connecting room', err));

      // getToken(name, roomName, _videoType, recording)
      //     .then(token => connect(token,name))
      //     .catch(error => console.log('Error fetching token: ', error));
    }
  };

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Join {roomName.substr(0, 10)}
      </Typography>

      <Grid container justify="center">
        <Grid item md={7} sm={12} xs={12}>
          <div className={classes.localPreviewContainer}>
            <LocalVideoPreview identity={name} />
            {/*<div id={"localVideoPreview"} style={{width:"100%",height:'100%'}}/>*/}
          </div>
          <div className={classes.mobileButtonBar}>
            <Hidden mdUp>
              <ToggleAudioButton className={classes.mobileButton} disabled={disableButtons} />
              <ToggleVideoButton className={classes.mobileButton} disabled={disableButtons} />
            </Hidden>
            <SettingsMenu mobileButtonClass={classes.mobileButton} />
          </div>
        </Grid>
        <Grid item md={5} sm={12} xs={12}>
          <Grid container direction="column" justify="space-between" style={{ height: '100%' }}>
            <div>
              <Hidden smDown>
                <ToggleAudioButton className={classes.deviceButton} disabled={disableButtons} />
                <ToggleVideoButton className={classes.deviceButton} disabled={disableButtons} />
              </Hidden>
            </div>
            <div className={classes.joinButtons}>
              <Button variant="outlined" color="primary" onClick={() => setStep(Steps.roomNameStep)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                data-cy-join-now
                onClick={handleJoin}
                disabled={disableButtons}
              >
                Join Now
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
