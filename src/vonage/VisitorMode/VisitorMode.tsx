import React from 'react';
import { styled, Theme } from '@material-ui/core/styles';

import useHeight from '../../hooks/useHeight/useHeight';
import '../override-style.scss';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams } from 'react-router-dom';
import ParticipantList from '../../Customizations/ParticipantList';
import ParticipantGrid from '../ParticipantGrid/ParticipantGrid';

const Container = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
});

const Main = styled('main')(({ theme }: { theme: Theme }) => ({
  overflow: 'hidden',
  paddingBottom: `${theme.footerHeight + theme.topBarHeight}px`, // Leave some space for the footer
  background: 'black',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: `${theme.mobileFooterHeight + theme.mobileTopBarHeight}px`, // Leave some space for the mobile header and footer
  },
}));

//Otcore adds the video DOM inside this hidden element initially.
//Then we're placing them in the desired places.
const HiddenVideoContainer = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'none',
}));

export default function VisitorMode(props) {
  const { roomState, connect, localParticipant } = useVideoContext();
  const { URLRoomName: _roomName } = useParams();
  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  React.useEffect(() => {
    connect(_roomName, 'Visitors|' + Math.random().toString(), true)
      .then(r => console.log('Connected to room'))
      .catch(err => console.log('Error connecting room', err));
  }, []);

  const previewReady = localParticipant && roomState !== 'disconnected';

  return (
    <Container style={{ height, width: '100%' }}>
      <HiddenVideoContainer id={'hiddenVideoContainer'} />
      {previewReady ? (
        <React.Fragment>
          <ParticipantGrid layoutType={'vertical'} />
          <ParticipantList />
        </React.Fragment>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <CircularProgress />
        </div>
      )}
    </Container>
  );
}
