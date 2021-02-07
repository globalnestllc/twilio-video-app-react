import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import App from './App';
import './types';
import { Divider, Paper, Slide, Tooltip } from '@material-ui/core';
import './index.scss';
import IconButton from '@material-ui/core/IconButton/IconButton';
import PeopleIcon from '@material-ui/icons/People';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';
import clsx from 'clsx';
import useVideoContext from './hooks/useVideoContext/useVideoContext';
import ParticipantList from './Customizations/ParticipantList';
import ToggleParticipantsOpen from './components/Buttons/ToggleParticipantsOpen';

const drawerWidth = 340;
const useStyles = makeStyles(theme => ({
  actionSection: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    textAlign: 'center',
  },
  hide: {
    display: 'none',
  },

  videoWrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  drawer: {
    // width: drawerWidth,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    transition: 'width 1s',
    height: '100%',
    paddingBottom: theme.footerHeight,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  contentShift: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: drawerWidth,
  },
}));

function AppWrapper(props) {
  let { shareLink, viewMode, isOpen } = props;

  // let params = new VideoCallParameters(props);

  const classes = useStyles();

  const { isConnecting, isSharingScreen, participantsOpen, setParticipantsOpen } = useVideoContext();

  React.useEffect(() => {
    if (isSharingScreen) {
      setParticipantsOpen(false);
    }
  }, [isSharingScreen]);

  React.useEffect(() => {
    if (isConnecting) {
      setParticipantsOpen(true);
    }
  }, [isConnecting]);

  const handleChatOpen = () => {};

  let gridMode = viewMode === 'grid';

  //Additional toolbar buttons in appbar

  function ToolbarButtons(props) {
    // return (
    // <>
    //     <Tooltip title={gridMode ? "Speaker mode" : "Gallery mode"}>
    //         <IconButton
    //             aria-label="toggle view mode"
    //             // onClick={() => dispatch(toggleViewMode())}
    //         >
    //             {gridMode ? <ViewCarouselIcon/> : <ViewComfyIcon/>}
    //         </IconButton>
    //     </Tooltip>
    //
    //     {/*{channel &&*/}
    //     <Tooltip title="Open chat">
    //         <IconButton
    //             aria-label="open chat"
    //             onClick={handleChatOpen}
    //         >
    //             <ChatBubbleIcon/>
    //         </IconButton>
    //     </Tooltip>
    //     {/*}*/}
    //
    //     <Tooltip title="Participants">
    //         <IconButton
    //             aria-label="open drawer"
    //             onClick={handleParticipantsOpen}
    //             className={clsx(participantsOpen && classes.hide)}
    //         >
    //             <PeopleIcon/>
    //         </IconButton>
    //     </Tooltip>
    //
    // </>
    // )
  }

  // let appProps = {...props};
  // if (channel) {
  //     appProps = {};
  //     //Keeping most parameters inside channel attributes.
  //     //This way once we get the channel we know the details about the video call.
  //     _.merge(appProps, props, channel.attributes);
  // }

  return (
    <Paper className={classes.videoWrapper}>
      <App />

      <div className={classes.contentShift} style={participantsOpen ? { width: drawerWidth } : { width: 0 }}>
        <Slide direction="left" in={participantsOpen}>
          <div className={classes.drawer}>
            <div className={classes.drawerHeader}>
              <ToggleParticipantsOpen hideWhenOpen={false} />
              {/*<IconButton onClick={()=>setParticipantsOpen(false)}>*/}
              {/*    {<ChevronRightIcon/>}*/}
              {/*</IconButton>*/}
            </div>
            <Divider />
            <ParticipantList />
            {/*<AttendeeList header="Participants" actions={{group: 'in-call', permissions}}*/}
            {/*              attendees={attendees} onAttendeeSelected={props.attendeeSelected}*/}
            {/*              style={{maxHeight: '100%', flexGrow: 1}}*/}
            {/*/>*/}
            {
              // Peer to peer doesn't support join by phone
              // params.room.type !== RoomTypes.PEER_TO_PEER &&
              // <div className={classes.actionSection}>
              //     <JoinByPhone roomName={params.room.name} identity={params.user.name}/>
              //     <Divider/>
              // </div>
            }
            {/*<CopyToClipboard header={'Share this link to invite!'}*/}
            {/*                 text={shareLink || `${window.location.origin}/join/video/${params.room.name}/${localStorageHelper.eventId}`}/>*/}
          </div>
        </Slide>
      </div>
    </Paper>
  );
}

export default AppWrapper;
