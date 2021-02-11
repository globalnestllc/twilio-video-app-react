import React from 'react';
import { initialVideoContainer } from './Config';

export default function useScreenShare(vonageSession) {
  const [publisher, setPublisher] = React.useState(null);
  const [isSharingScreen, setIsSharingScreen] = React.useState(false);

  const startScreenSharing = React.useCallback(() => {
    window.OT.checkScreenSharingCapability(response => {
      if (!response.supported || response.extensionRegistered === false) {
        console.error('This browser does not support screen sharing.');
      } else if (response.extensionInstalled === false) {
        console.error('Please install screen sharing extension or a newer version of the browser.');
        // Prompt to install the extension.
      } else {
        // Screen sharing is available. Publish the screen.
        let _publisher = window.OT.initPublisher(initialVideoContainer, { videoSource: 'screen' }, async error => {
          if (error) {
            console.error('Error creating screen share publisher', error);
            // Look at error.message to see what went wrong.
          } else {
            await vonageSession.publishLocal(_publisher, 'screen');
            setPublisher(_publisher);
            setIsSharingScreen(true);
          }
        });
      }
    });
  }, [vonageSession]);

  const endScreenSharing = React.useCallback(async () => {
    await vonageSession.unpublish(publisher, 'screen');
    setPublisher(null);
    setIsSharingScreen(false);
  }, [vonageSession, publisher]);

  const toggleScreenShare = React.useCallback(() => {
    if (isSharingScreen) {
      endScreenSharing();
    } else {
      startScreenSharing();
    }
  }, [startScreenSharing, endScreenSharing, isSharingScreen]);

  React.useEffect(() => {
    if (publisher) {
      publisher.on('mediaStopped', endScreenSharing);
      return () => {
        publisher.off('mediaStopped', endScreenSharing);
      };
    }
  }, [publisher, endScreenSharing]);

  return { toggleScreenShare, startScreenSharing, endScreenSharing, isSharingScreen, publisher };
}
