import React, { createContext, ReactNode } from 'react';
import {
  ConnectOptions,
  CreateLocalTrackOptions,
  LocalAudioTrack,
  LocalVideoTrack,
  Room,
  TwilioError,
} from 'twilio-video';
import { Callback, ErrorCallback } from '../../types';
import { SelectedParticipantProvider } from './useSelectedParticipant/useSelectedParticipant';

import AttachVisibilityHandler from './AttachVisibilityHandler/AttachVisibilityHandler';
import useHandleRoomDisconnectionErrors from './useHandleRoomDisconnectionErrors/useHandleRoomDisconnectionErrors';
import useHandleOnDisconnect from './useHandleOnDisconnect/useHandleOnDisconnect';
import useHandleTrackPublicationFailed from './useHandleTrackPublicationFailed/useHandleTrackPublicationFailed';
import useLocalTracks from './useLocalTracks/useLocalTracks';
import useRoom from './useRoom/useRoom';
import { Connection, OtCore, Participant } from '../../vonage/types';
import { useAppState } from '../../state';
import getOtCore from '../../vonage/useOtCore';
import useLocalParticipant from '../../vonage/useLocalParticipant';
import useRoomState from '../../hooks/useRoomState/useRoomState';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

/*
 *  The hooks used by the VideoProvider component are different than the hooks found in the 'hooks/' directory. The hooks
 *  in the 'hooks/' directory can be used anywhere in a video application, and they can be used any number of times.
 *  the hooks in the 'VideoProvider/' directory are intended to be used by the VideoProvider component only. Using these hooks
 *  elsewhere in the application may cause problems as these hooks should not be used more than once in an application.
 */

type ViewModeType = 'grid' | 'collaborator';

export interface IVideoContext {
  room: Room;
  localTracks: (LocalAudioTrack | LocalVideoTrack)[];
  connect: (roomName: string, name: string) => Promise<void>;
  onError: ErrorCallback;
  onDisconnect: Callback;
  getLocalVideoTrack: (newOptions?: CreateLocalTrackOptions) => Promise<LocalVideoTrack>;
  getLocalAudioTrack: (deviceId?: string) => Promise<LocalAudioTrack>;
  isAcquiringLocalTracks: boolean;
  removeLocalVideoTrack: () => void;
  isSharingScreen: boolean;
  toggleScreenShare: () => void;
  getAudioAndVideoTracks: () => Promise<void>;
  toggleVideoEnabled: () => void;
  toggleAudioEnabled: () => void;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  endCall: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  sharingScreen: boolean;
  viewingSharedScreen: boolean;
  screenShareActive: boolean;
  activeCameraSubscribers: number;
  connections: object;
  connection: Connection;
  publishers: any[];
  subscribers: any[];
  localParticipant: Participant;
  screenShareParticipant: { camera: Participant; screen: Participant };
  otCore: OtCore;
  displayName: string;
  roomState: string;

  viewMode: ViewModeType;
  toggleViewMode: () => void;
  participantsOpen: boolean;
  setParticipantsOpen: (value: boolean | ((boolean) => boolean)) => void;
  removeParticipant: (any) => void;
}

export const VideoContext = createContext<IVideoContext>(null!);

interface VideoProviderProps {
  options?: ConnectOptions;
  onError: ErrorCallback;
  onDisconnect?: Callback;
  children: ReactNode;
}

const events = [
  'subscribeToCamera',
  'unsubscribeFromCamera',
  'subscribeToScreen',
  'unsubscribeFromScreen',
  'startScreenShare',
  'endScreenShare',
  'connectionCreated',
  'connectionDestroyed',
  'sessionConnected',
  'sessionDisconnected',
  'sessionReconnected',
  'sessionReconnecting',
  'streamCreated',
  'streamPropertyChanged',
];

export function VideoProvider({ options, children, onError = () => {}, onDisconnect = () => {} }: VideoProviderProps) {
  const [sharingScreen, setSharingScreen] = React.useState(false);
  const [viewingSharedScreen, setViewingSharedScreen] = React.useState(false);
  const [screenShareActive, setScreenShareActive] = React.useState(false);
  const [activeCameraSubscribers, setActiveCameraSubscribers] = React.useState(0);
  const [connections, setConnections] = React.useState([]);
  const [connection, setConnection] = React.useState({ id: null });
  const [publishers, setPublishers] = React.useState([]);
  const [subscribers, setSubscribers] = React.useState([]);
  const [screenShareParticipant, setScreenShareParticipant] = React.useState(null);
  const [otCore, setOtCore] = React.useState(null);
  const [viewMode, setViewMode] = React.useState('collaborator' as ViewModeType);
  const [participantsOpen, setParticipantsOpen] = React.useState(false);
  const [session, setSession] = React.useState(null);

  const { roomState } = useVideoContext();
  const { publisher: localParticipant } = useLocalParticipant();

  // const [roomState, _setRoomState] = React.useState('disconnected');

  // function setRoomState(state) {
  //     console.log('Setting room state',state);
  //     _setRoomState(state);
  // }

  const { getToken, getSession, displayName, setUserName } = useAppState();

  function removeParticipant(connection) {
    otCore.session.forceDisconnect(connection);
  }

  function toggleViewMode() {
    setViewMode(viewMode => {
      if (viewMode === 'grid') {
        return 'collaborator' as ViewModeType;
      } else {
        return 'grid' as ViewModeType;
      }
    });
  }

  function handleEvent(event, state) {
    console.log('otcore Event', event, state);
    switch (event) {
      case 'endScreenShare':
        setIsSharingScreen(false);
        break;
      case 'startScreenShare':
        setIsSharingScreen(true);
        break;
      case 'subscribeToCamera':
      case 'subscribeToScreen':
        let subscribers = state.subscribers;
        [...Object.values(subscribers.camera), ...Object.values(subscribers.screen)].forEach(subscriber => {
          // @ts-ignore
          subscriber.setStyle('nameDisplayMode', 'off');
        });
        break;
      case 'sessionConnected':
        // setRoomState('connected');
        setIsConnected(true);
        setIsConnecting(false);
        break;
      case 'sessionDisconnected':
        // setRoomState('disconnected')
        setIsConnected(false);
        setIsConnecting(false);
        break;
      case 'sessionReconnected':
        // setRoomState('connected')
        setIsConnected(true);
        setIsConnecting(false);
        break;
      case 'sessionReconnecting':
        // setRoomState('reconnecting')
        setIsConnected(false);
        setIsConnecting(true);
        break;
    }
  }

  function setState(_state, event, callback) {
    let state = otCore.state();
    handleEvent(event, state);

    const { publishers, subscribers, active, meta, localAudioEnabled, localVideoEnabled } = state;

    setSharingScreen(!!meta.publisher.screen);
    setViewingSharedScreen(meta.subscriber.screen);
    setScreenShareActive(viewingSharedScreen || sharingScreen);
    setActiveCameraSubscribers(meta.subscriber.camera);

    setConnections(otCore.session.connections.map(c => c).filter(connection => !connection.id.includes('.tokbox.com')));
    setConnection(otCore.session.connection || {});

    let _cameraPublishers = Object.values(publishers.camera);
    let _cameraSubscribers = Object.values(subscribers.camera);
    let _screenSubscribers = Object.values(subscribers.screen);
    let _screenPublishers = Object.values(subscribers.screen);

    setPublishers(_cameraPublishers);
    setSubscribers(_cameraSubscribers);

    if (meta.publisher.screen) {
      setScreenShareParticipant({ camera: _cameraPublishers[0], screen: _screenPublishers[0] });
    } else if (meta.subscriber.screen) {
      // Find the camera source of the screen sharing participant.
      // @ts-ignore
      let _screenShareParticipant = _cameraSubscribers.find(
        subscriber => subscriber.stream.connection.id === _screenSubscribers[0].stream.connection.id
      );
      setScreenShareParticipant({ camera: _screenShareParticipant, screen: _screenSubscribers[0] });
    } else {
      setScreenShareParticipant({ camera: null, screen: null });
    }
  }

  React.useEffect(() => {
    // console.log('otcore Event1 publishers', publishers)

    function setOtCoreState(state, event, callback) {
      setState(state, event, callback);
    }

    publishers.forEach(publisher => publisher.on('streamCreated', setOtCoreState));
    publishers.forEach(publisher => publisher.on('streamDestroyed', setOtCoreState));
    publishers.forEach(publisher => publisher.on('mediaStopped', setOtCoreState));
    return () => {
      publishers.forEach(publisher => publisher.off('streamCreated', setOtCoreState));
      publishers.forEach(publisher => publisher.off('streamDestroyed', setOtCoreState));
    };
  }, [publishers]);

  React.useEffect(() => {
    if (otCore) {
      const setOtCoreState = ({ publishers, subscribers, meta }, event, callback) => {
        setState({ publishers, subscribers, meta }, event, callback);
      };

      events.forEach(event => otCore.on(event, setOtCoreState));
      return () => {
        events.forEach(event => otCore.off(event, setOtCoreState));
      };
    }
  }, [otCore]);

  React.useEffect(() => {
    if (otCore && displayName) {
      console.log('otcore connect1', otCore, displayName);
      otCore.connect().then(() => {
        console.log('otCore connected');
        let publisherStyle = {
          nameDisplayMode: 'off',
          audioLevelDisplayMode: 'off',
          archiveStatusDisplayMode: 'on',
          buttonDisplayMode: 'on',
        };

        otCore
          .startCall({ style: publisherStyle, name: displayName })
          .then(r => {
            setIsConnected(true);
            setIsConnecting(false);
            console.log('otCore.startCall() success', r);
            setState(r, 'callStarted', null);
          })
          .catch(r => {
            setIsConnecting(false);
            setIsConnected(false);
            console.log('otCore.startCall() error', r);
            setState(r, 'errorStartingCall', null);
          });
      });
    }

    return () => {
      if (otCore) {
        endCall();
      }
    };
  }, [otCore]);

  const onErrorCallback = (error: TwilioError) => {
    console.log(`ERROR: ${error.message}`, error);
    onError(error);
  };

  const {
    localTracks,
    getLocalVideoTrack,
    getLocalAudioTrack,
    isAcquiringLocalTracks,
    removeLocalVideoTrack,
    getAudioAndVideoTracks,
  } = useLocalTracks();
  const { room } = useRoom(localTracks, onErrorCallback, options);

  // Register onError and onDisconnect callback functions.
  useHandleRoomDisconnectionErrors(room, onError);
  useHandleTrackPublicationFailed(room, onError);
  useHandleOnDisconnect(room, onDisconnect);

  const [isVideoEnabled, setVideoEnabled] = React.useState(true);
  const [isAudioEnabled, setAudioEnabled] = React.useState(true);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isSharingScreen, setIsSharingScreen] = React.useState(false);

  function toggleVideoEnabled() {
    console.log('toggling video to ', !isVideoEnabled);
    otCore.toggleLocalVideo(!isVideoEnabled);
    setVideoEnabled(!isVideoEnabled);
  }

  function toggleAudioEnabled() {
    otCore.toggleLocalAudio(!isAudioEnabled);
    setAudioEnabled(!isAudioEnabled);
  }

  function toggleScreenShare() {
    try {
      if (isSharingScreen) {
        otCore.screenSharing.end();
      } else {
        otCore.screenSharing.start();
      }
    } catch (e) {
      return isSharingScreen;
    }
  }

  function endCall() {
    if (!isConnected) {
      return;
    }
    otCore.endCall();
    otCore.session.disconnect();
    setIsConnecting(false);
    setIsConnected(false);
  }

  async function connect(roomName: string | null = null, name: string) {
    console.log('otCore startCall()');
    if (isConnecting || isConnected) {
      console.log('otCore startCall() return');
      return;
    }

    setUserName(name);

    console.log('otCore startCall() yeah');
    setIsConnecting(true);

    let { sessionId } = await getSession(roomName);

    let token = await getToken(name, roomName);
    console.log('tokennnnn:', token);
    let otCore = getOtCore(sessionId, token, name);
    setOtCore(otCore);
  }

  return (
    <VideoContext.Provider
      value={{
        sharingScreen,
        viewingSharedScreen,
        screenShareActive,
        activeCameraSubscribers,
        connections,
        endCall,
        toggleVideoEnabled,
        toggleAudioEnabled,
        isVideoEnabled,
        isAudioEnabled,
        isConnected,
        connection,
        publishers,
        subscribers,
        localParticipant,
        screenShareParticipant,
        otCore,
        displayName,
        viewMode,
        toggleViewMode,
        participantsOpen,
        setParticipantsOpen,
        removeParticipant,
        roomState,

        room,
        localTracks,
        isConnecting,
        onError: onErrorCallback,
        onDisconnect,
        getLocalVideoTrack,
        getLocalAudioTrack,
        connect,
        isAcquiringLocalTracks,
        removeLocalVideoTrack,
        isSharingScreen,
        toggleScreenShare,
        getAudioAndVideoTracks,
      }}
    >
      <SelectedParticipantProvider room={room}>{children}</SelectedParticipantProvider>
      {/*
        The AttachVisibilityHandler component is using the useLocalVideoToggle hook
        which must be used within the VideoContext Provider.
      */}
      <AttachVisibilityHandler />
    </VideoContext.Provider>
  );
}
