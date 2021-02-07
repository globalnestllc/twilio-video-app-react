import React from 'react';
import NetworkTest from 'opentok-network-test-js';
import useVideoContext from '../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../state';

export default function useNetworkTest(name) {
  const { connect } = useVideoContext();
  const { getToken, getSession } = useAppState();
  const [networkTest, setNetworkTest] = React.useState(null);

  function stopTest() {
    if (networkTest) {
      networkTest.stop();
    }
  }
  async function startTest() {
    let { sessionId, roomName } = await getSession();
    let token = await getToken(name, roomName);

    const otNetworkTest = new NetworkTest(
      window.OT,
      {
        apiKey: '47099484', // Add the API key for your OpenTok project here.
        sessionId: sessionId,
        token: token, // Add a token for that session here
      },
      {
        timeout: 6000,
      }
    );
    setNetworkTest(otNetworkTest);
    window.otNetworkTest = otNetworkTest;
    otNetworkTest
      .testConnectivity()
      .then(results => {
        console.log('OpenTok connectivity test results', results);
        otNetworkTest
          .testQuality(function updateCallback(stats) {
            console.log('intermediate testQuality stats', stats);
          })
          .then(results => {
            // This function is called when the quality test is completed.
            console.log('OpenTok quality results', results);
            let publisherSettings = {};
            if (results.video.reason) {
              console.log('Video not supported:', results.video.reason);
              publisherSettings.videoSource = null; // audio-only
            } else {
              publisherSettings.frameRate = results.video.recommendedFrameRate;
              publisherSettings.resolution = results.video.recommendedResolution;
            }
            if (!results.audio.supported) {
              console.log('Audio not supported:', results.audio.reason);
              publisherSettings.audioSource = null;
              // video-only, but you probably don't want this -- notify the user?
            }
            if (!publisherSettings.videoSource && !publisherSettings.audioSource) {
              // Do not publish. Notify the user.
            } else {
              // Publish to the "real" session, using the publisherSettings object.
            }
          })
          .catch(error => {
            console.log('OpenTok quality test error', error);
          });
      })
      .catch(function(error) {
        console.log('OpenTok connectivity test error', error);
      });

    return () => {
      otNetworkTest.stop();
    };
  }

  React.useEffect(() => {
    startTest();
  }, []);

  return { stopTest: 1 };
}
