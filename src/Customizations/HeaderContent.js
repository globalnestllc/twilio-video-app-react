import { Typography } from '@material-ui/core';
// import RemainingTime from "@eventdex/video/src/components/CustomizeVideo/RemainingTime";
// import {VIDEO_CALL_TYPE} from "@eventdex/video/src/store/entities/VideoCallParameters";
// import NoShow from "@eventdex/video/src/components/NoShow/NoShow";
import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme =>
  createStyles({
    headerContent: {
      display: 'flex',
      flex: '1 2 0',
      justifyContent: 'space-evenly',
      '& >*': {
        marginLeft: '20px',
      },
    },
  })
);

export default function HeaderContent(props) {
  const { connected = true, videoParams, timeToStart, timeToEnd, message } = props;

  const classes = useStyles();

  return (
    <Typography variant={'h5'} component={'div'} className={classes.headerContent}>
      {
        // connected &&
        // <span>{videoParams.user.name}</span>
      }
      {message && (
        <Typography variant={'h6'} color={'primary'}>
          {' '}
          {message}{' '}
        </Typography>
      )
      // message ? <Typography variant={'h6'} color={"primary"}> {message} </Typography>
      // : videoParams.isTimeBound
      // && <RemainingTime timeToStart={timeToStart} timeToEnd={timeToEnd}/>
      }
      {
        // connected &&
        // (
        //     videoParams.type.name === VIDEO_CALL_TYPE.Appointment.name ||
        //     videoParams.type.name === VIDEO_CALL_TYPE.Roundtable.name
        // )
        // &&
        // <NoShow meetingId={videoParams.room.name} startTime={videoParams.timeBound.start}/>
      }
    </Typography>
  );
}
