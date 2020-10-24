import React, { createContext, useContext, useReducer, useState } from 'react';
import { RoomType } from '../types';
import { TwilioError } from 'twilio-video';
import { settingsReducer, initialSettings, Settings, SettingsAction } from './settings/settingsReducer';
import useActiveSinkId from './useActiveSinkId/useActiveSinkId';
import useFirebaseAuth from './useFirebaseAuth/useFirebaseAuth';
import usePasscodeAuth from './usePasscodeAuth/usePasscodeAuth';
import { User } from 'firebase';

export interface StateContextType {
  displayName: string;
  error: TwilioError | null;
  setError(error: TwilioError | null): void;
  getToken(
    name: string,
    room: string,
    room_type?: string,
    recording?: boolean | string,
    passcode?: string
  ): Promise<string>;
  setUserName(name: string): void;
  user?: User | null | { displayName: undefined; photoURL: undefined; passcode?: string };
  signIn?(passcode?: string): Promise<void>;
  signOut?(): Promise<void>;
  isAuthReady?: boolean;
  isFetching: boolean;
  activeSinkId: string;
  setActiveSinkId(sinkId: string): void;
  settings: Settings;
  dispatchSetting: React.Dispatch<SettingsAction>;
  roomType?: RoomType;
  showToast(severity: string, message: string): void;
  hideToast(): void;
  toast: { open: false; message: ''; severity: 'info' };
}

export const StateContext = createContext<StateContextType>(null!);

/*
  The 'react-hooks/rules-of-hooks' linting rules prevent React Hooks fron being called
  inside of if() statements. This is because hooks must always be called in the same order
  every time a component is rendered. The 'react-hooks/rules-of-hooks' rule is disabled below
  because the "if (process.env.REACT_APP_SET_AUTH === 'firebase')" statements are evaluated
  at build time (not runtime). If the statement evaluates to false, then the code is not
  included in the bundle that is produced (due to tree-shaking). Thus, in this instance, it
  is ok to call hooks inside if() statements.
*/
export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [activeSinkId, setActiveSinkId] = useActiveSinkId();
  const [settings, dispatchSetting] = useReducer(settingsReducer, initialSettings);

  const [displayName, setDisplayName] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: '' });

  let contextValue = {
    displayName,
    error,
    setError,
    isFetching,
    activeSinkId,
    setActiveSinkId,
    settings,
    dispatchSetting,
    toast,
  } as StateContextType;

  if (process.env.REACT_APP_SET_AUTH === 'firebase') {
    contextValue = {
      ...contextValue,
      ...useFirebaseAuth(), // eslint-disable-line react-hooks/rules-of-hooks
    };
  } else if (process.env.REACT_APP_SET_AUTH === 'passcode') {
    contextValue = {
      ...contextValue,
      ...usePasscodeAuth(), // eslint-disable-line react-hooks/rules-of-hooks
    };
  } else {
    contextValue = {
      ...contextValue,
      getToken: async (identity, unique_name, room_type = 'peer-to-peer', recording = false) => {
        const headers = new window.Headers();
        const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';
        const params = new window.URLSearchParams({
          identity,
          unique_name,
          room_type,
          recording: recording.toString(),
        });
        let res = await fetch(`${endpoint}?${params}`, { headers });

        let responseText = await res.text();
        if (responseText === 'duplicate-identity') {
          let error = new Error('This user name is being used, please pick another one and join.') as TwilioError;
          setError(error);
          throw error;
        }
        return responseText;
      },
    };
  }
  const showToast = (severity: string, message: string) => {
    setToast({
      open: true,
      message,
      severity,
    });
  };
  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  const getToken: StateContextType['getToken'] = (name, room, room_type, recording) => {
    setIsFetching(true);
    return contextValue
      .getToken(name, room, room_type, recording)
      .then(res => {
        setIsFetching(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetching(false);
        return Promise.reject(err);
      });
  };

  const setUserName = (name: string) => {
    setDisplayName(name);
  };

  return (
    <StateContext.Provider value={{ ...contextValue, getToken, setUserName, showToast, hideToast }}>
      {props.children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
