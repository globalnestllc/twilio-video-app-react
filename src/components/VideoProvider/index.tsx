import React, { createContext, ReactNode } from 'react';
import { ConnectOptions, TwilioError } from 'twilio-video';
import { Callback, ErrorCallback } from '../../types';
import { SelectedParticipantProvider } from './useSelectedParticipant/useSelectedParticipant';

import AttachVisibilityHandler from './AttachVisibilityHandler/AttachVisibilityHandler';
import { Connection, Participant, SessionProps } from '../../vonage/types';
import { useAppState } from '../../state';
import useLocalParticipant from '../../vonage/useLocalParticipant';
import useSession from '../../vonage/useSession';
import useScreenShare from '../../vonage/useScreenShare';

/*
 *  The hooks used by the VideoProvider component are different than the hooks found in the 'hooks/' directory. The hooks
 *  in the 'hooks/' directory can be used anywhere in a video application, and they can be used any number of times.
 *  the hooks in the 'VideoProvider/' directory are intended to be used by the VideoProvider component only. Using these hooks
 *  elsewhere in the application may cause problems as these hooks should not be used more than once in an application.
 */

type ViewModeType = 'grid' | 'collaborator';

export interface IVideoContext {
  connect: (roomName: string, name: string) => Promise<void>;
  onError: ErrorCallback;
  onDisconnect: Callback;
  isSharingScreen: boolean;
  toggleScreenShare: () => void;
  toggleVideoEnabled: () => void;
  toggleAudioEnabled: () => void;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  endCall: () => void;
  startCall: any; //() => void;
  viewingSharedScreen: boolean;
  screenShareActive: boolean;
  connections: object;
  connection: Connection;
  publishers: any[];
  subscribers: any[];
  localParticipant: Participant;
  screenShareParticipant: { camera: Participant; screen: Participant };
  displayName: string;
  roomState: string;

  viewMode: ViewModeType;
  toggleViewMode: () => void;
  participantsOpen: boolean;
  setParticipantsOpen: (value: boolean | ((boolean) => boolean)) => void;
  removeParticipant: (any) => void;
  sessionData: SessionProps;
  session: object;
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
  'sessionReconnected',
  'sessionReconnecting',
  'streamCreated',
  'streamDestroyed',
  'streamPropertyChanged',
];

export function VideoProvider({ options, children, onError = () => {}, onDisconnect = () => {} }: VideoProviderProps) {
  const [viewMode, setViewMode] = React.useState('collaborator' as ViewModeType);
  const [participantsOpen, setParticipantsOpen] = React.useState(false);

  const {
    viewingSharedScreen,
    screenShareActive,
    screenShareParticipant, //screen share
    connect,
    subscribers,
    publishers,
    roomState,
    sessionData,
    connection,
    connections,
    vonageSession,
  } = useSession();

  const { displayName } = useAppState();

  const {
    publisher: localParticipant,
    toggleAudioEnabled,
    toggleVideoEnabled,
    isVideoEnabled,
    isAudioEnabled,
  } = useLocalParticipant(displayName);

  let { toggleScreenShare, isSharingScreen } = useScreenShare(vonageSession);

  function removeParticipant(connection) {
    vonageSession.forceDisconnect(connection);
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

  const onErrorCallback = (error: TwilioError) => {
    console.log(`ERROR: ${error.message}`, error);
    onError(error);
  };

  function endCall() {
    vonageSession?.disconnect();
  }

  async function startCall(a, b) {}

  const connectAndStartCall = (roomName, name) => {
    return connect(roomName, name).then(session => {
      session.publishLocal(localParticipant);
    });
  };

  let contextValue = {
    viewingSharedScreen,
    screenShareActive,
    connections,
    endCall,
    startCall,
    toggleVideoEnabled,
    toggleAudioEnabled,
    isVideoEnabled,
    isAudioEnabled,

    connection,
    publishers,
    subscribers,
    localParticipant,
    screenShareParticipant,
    displayName,
    viewMode,
    toggleViewMode,
    participantsOpen,
    setParticipantsOpen,
    removeParticipant,
    roomState,
    onError: onErrorCallback,
    onDisconnect,
    connect: connectAndStartCall,
    isSharingScreen,
    toggleScreenShare,
    sessionData,
  };
  // @ts-ignore
  window.contextValue = contextValue;

  return (
    // @ts-ignore>
    <VideoContext.Provider value={contextValue}>
      <SelectedParticipantProvider>{children}</SelectedParticipantProvider>
      {/*
        The AttachVisibilityHandler component is using the useLocalVideoToggle hook
        which must be used within the VideoContext Provider.
      */}
      <AttachVisibilityHandler />
    </VideoContext.Provider>
  );
}
