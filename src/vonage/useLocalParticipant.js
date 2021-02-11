import React from 'react';
import { initialVideoContainer, publisherOptions } from './Config';

export default function useLocalParticipant(name) {
  const [publisher, setPublisher] = React.useState(null);
  const [isVideoEnabled, setVideoEnabled] = React.useState(true);
  const [isAudioEnabled, setAudioEnabled] = React.useState(true);

  React.useEffect(() => {
    if (name) {
      console.log('Publisher creating', initialVideoContainer);
      let publisher = window.OT.initPublisher(
        initialVideoContainer,
        {
          ...publisherOptions,
          name: name,
        },
        error => {
          if (error) {
            console.log(error);
          } else {
            setPublisher(publisher);
          }
        }
      );

      return () => {
        publisher.destroy();
      };
    }
  }, [name]);

  function toggleVideoEnabled() {
    publisher.publishVideo(!isVideoEnabled);
    setVideoEnabled(!isVideoEnabled);
  }

  function toggleAudioEnabled() {
    publisher.publishAudio(!isAudioEnabled);
    setAudioEnabled(!isAudioEnabled);
  }

  return {
    publisher,
    toggleVideoEnabled,
    toggleAudioEnabled,
    isVideoEnabled,
    isAudioEnabled,
  };
}
