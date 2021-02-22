import { Grid, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import EndCallButton from '../Buttons/EndCallButton/EndCallButton';
import Menu from '../MenuBar/Menu/Menu';
import IconButton from '@material-ui/core/IconButton/IconButton';
import ViewModeButton from '../Buttons/ViewModeButton';
import ToggleFullscreenButton from '../Buttons/ToggleFullScreenButton/ToggleFullScreenButton';
import CloseIcon from '@material-ui/icons/Close';
import ToggleParticipantsOpen from '../Buttons/ToggleParticipantsOpen';
import BroadCastLayout from '../MenuBar/BroadCastLayout/BroadCastLayout';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    background: 'white',
    paddingLeft: '1em',
    height: `${theme.topBarHeight}px`,
    [theme.breakpoints.down('sm')]: {
      height: `${theme.mobileTopBarHeight}px`,
      display: 'flex',
    },
  },
  endCallButton: {
    height: '28px',
    fontSize: '0.85rem',
    padding: '0 0.6em',
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'inline-flex',
    },
  },
  settingsButton: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'inline-flex',
      height: '28px',
      minWidth: '28px',
      border: '1px solid rgb(136, 140, 142)',
      padding: 0,
      margin: '0 1em',
    },
  },
}));

export default function MobileTopMenuBar(props) {
  const classes = useStyles();
  const { participantsOpen, sessionData, broadcast } = useVideoContext();

  return (
    <Grid container alignItems="center" justify="space-between" className={classes.container}>
      <Typography variant="subtitle1">{sessionData.roomName}</Typography>
      <div>
        <EndCallButton className={classes.endCallButton} />
        {!participantsOpen && (
          <React.Fragment>
            <Menu buttonClassName={classes.settingsButton} />
            <ToggleFullscreenButton />
          </React.Fragment>
        )}
        <IconButton
          aria-label="close"
          // onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>

        {!participantsOpen && !broadcast && <ViewModeButton />}
        {broadcast && !participantsOpen && <BroadCastLayout />}
        <ToggleParticipantsOpen hideWhenOpen={true} />

        {/*/!*{channel &&*!/*/}
        {/*<Tooltip title="Open chat">*/}
        {/*  <IconButton*/}
        {/*      aria-label="open chat"*/}
        {/*      onClick={handleChatOpen}*/}
        {/*  >*/}
        {/*    <ChatBubbleIcon/>*/}
        {/*  </IconButton>*/}
        {/*</Tooltip>*/}
        {/*/!*}*!/*/}
      </div>
    </Grid>
  );
}
