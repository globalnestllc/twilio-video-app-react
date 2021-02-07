import ScreenShareAccPack from 'opentok-screen-sharing';
import React from 'react';

export default function useScreenShare(session) {
  const screenShareOptions = session => ({
    session: session,
    extensionID: 'plocfffmbcclpdifaikiikgplfnepkpo',
    screensharingParent: '#hiddenVideoContainer',
  });

  const [screenShare, setScreenShare] = React.useState(null);
  const [isSharingScreen, setIsSharingScreen] = React.useState(false);

  React.useEffect(() => {
    const createScreenShare = () => {
      const screenShare = new ScreenShareAccPack(screenShareOptions(session));
      setScreenShare(screenShare);
    };
    if (session) {
      session.on('sessionConnected', createScreenShare);
      return () => {
        session.off('sessionConnected', createScreenShare);
      };
    }
  }, [session]);

  React.useEffect(() => {
    if (screenShare) {
      screenShare.on('startScreenShare', startScreenSharing);
      screenShare.on('endScreenShare', endScreenSharing);

      return () => {
        setIsSharingScreen(false);
        screenShare.off('startScreenShare', startScreenSharing);
        screenShare.off('endScreenShare', endScreenSharing);
      };
    }
  }, [screenShare]);

  const startScreenSharing = React.useCallback(() => {
    screenShare.start();
  }, [screenShare]);

  const endScreenSharing = React.useCallback(() => {
    screenShare.end();
  }, [screenShare]);

  const toggleScreenShare = React.useCallback(() => {
    screenShare.end();
  }, [screenShare]);

  return { toggleScreenShare, startScreenSharing, endScreenSharing, isSharingScreen };
}
