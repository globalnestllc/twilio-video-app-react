import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import App from './App';
import './types';
import { Divider, Paper, Slide } from '@material-ui/core';
import './index.scss';
import useVideoContext from './hooks/useVideoContext/useVideoContext';
import ToggleParticipantsOpen from './components/Buttons/ToggleParticipantsOpen';
import VideoParticipants from './Customizations/VideoParticipants';
import VisitorMode from './vonage/VisitorMode/VisitorMode';
import { useParams } from 'react-router-dom';

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

  const { isSharingScreen, participantsOpen, setParticipantsOpen } = useVideoContext();

  React.useEffect(() => {
    if (isSharingScreen) {
      setParticipantsOpen(false);
    }
  }, [isSharingScreen]);

  const handleChatOpen = () => {};

  let gridMode = viewMode === 'grid';

  // let appProps = {...props};
  // if (channel) {
  //     appProps = {};
  //     //Keeping most parameters inside channel attributes.
  //     //This way once we get the channel we know the details about the video call.
  //     _.merge(appProps, props, channel.attributes);
  // }

  const { visitor: visitorMode } = useParams();
  return (
    <Paper className={classes.videoWrapper}>
      {visitorMode ? <VisitorMode /> : <App />}

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
            {/*<ParticipantList />*/}
            <VideoParticipants />
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
