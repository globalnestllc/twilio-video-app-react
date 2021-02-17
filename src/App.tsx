import React from 'react';
import { styled, Theme } from '@material-ui/core/styles';

import MenuBar from './components/MenuBar/MenuBar';
import MobileTopMenuBar from './components/MobileTopMenuBar/MobileTopMenuBar';
import PreJoinScreens from './components/PreJoinScreens/PreJoinScreens';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Room from './components/Room/Room';

import useHeight from './hooks/useHeight/useHeight';
import './vonage/override-style.scss';
import useVideoContext from './hooks/useVideoContext/useVideoContext';
import BroadcastRoom from './components/BroadcastRoom/BroadcastRoom';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: '1fr auto',
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

export default function App(props) {
  const { roomState, broadcast, broadcastLayout } = useVideoContext();
  console.log('Broadcast status' + broadcast);
  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  return (
    <Container style={{ height, width: '100%' }}>
      <HiddenVideoContainer id={'hiddenVideoContainer'} />
      {roomState === 'disconnected' ? (
        <PreJoinScreens />
      ) : (
        <Main>
          {/*<VideoTopBar {...props} />*/}
          <ReconnectingNotification />
          <MobileTopMenuBar />
          {broadcast && <BroadcastRoom layoutOption={broadcastLayout} />}
          {!broadcast && <Room />}
          <MenuBar />
        </Main>
      )}
    </Container>
  );
}
