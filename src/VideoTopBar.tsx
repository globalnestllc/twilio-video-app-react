import { AppBar, createStyles, IconButton, Menu, Theme, Toolbar, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import useRoomState from './hooks/useRoomState/useRoomState';
import useVideoContext from './hooks/useVideoContext/useVideoContext';
import { makeStyles } from '@material-ui/core/styles';
import FlipCameraButton from './components/MenuBar/FlipCameraButton/FlipCameraButton';
import LocalAudioLevelIndicator from './components/LocalAudioLevelIndicator/LocalAudioLevelIndicator';
import ToggleFullscreenButton from './components/Buttons/ToggleFullScreenButton/ToggleFullScreenButton';
import useMenuBar from './Customizations/useMenuBar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
    },
    toolbar: {
      [theme.breakpoints.down('xs')]: {
        padding: 0,
      },
    },
    rightButtonContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginLeft: 'auto',
      flex: 1,
      justifyContent: 'flex-end',
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        marginLeft: '2.2em',
      },
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    loadingSpinner: {
      marginLeft: '1em',
    },
    displayName: {
      marginLeft: '2.2em',
      minWidth: '200px',
      fontWeight: 600,
    },
    joinButton: {
      margin: '1em',
    },
    textFieldnone: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
      display: 'none',
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
export default function VideoTopBar(props) {
  const classes = useStyles();
  const { displayName, roomState } = useVideoContext();

  // let isConnected = roomState !== 'disconnected';

  // const {
  //     joinButtonEnabled, headerMessage, HeaderContent,
  //     handleClose
  // } = useMenuBar(props, isConnected);

  return (
    <AppBar className={classes.container} position="static">
      {/*<Toolbar className={classes.toolbar}>*/}
      {/*    {HeaderContent}*/}
      {/*    <div className={classes.rightButtonContainer}>*/}
      {/*        <FlipCameraButton/>*/}
      {/*        <LocalAudioLevelIndicator/>*/}
      {/*        <ToggleFullscreenButton/>*/}
      {/*        <IconButton aria-label="close" onClick={handleClose}>*/}
      {/*            <CloseIcon/>*/}
      {/*        </IconButton>*/}
      {/*        {*/}
      {/*            props.toolbarButtons*/}
      {/*        }*/}
      {/*    </div>*/}
      {/*</Toolbar>*/}
    </AppBar>
  );
}
