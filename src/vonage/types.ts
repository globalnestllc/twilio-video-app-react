export interface Connection {
  id: string;
}

interface Handler {
  (e): void;
}

interface OtEventHandler {
  (event: string, handler: Handler): any;
}

export interface OtCore {
  state: () => object;
  on: OtEventHandler;
  off: OtEventHandler;
}

export interface Stream {
  name: 'string';
}

export interface Participant {
  element: HTMLElement;
  id: string;
  identity: string;
  getVideoSource: () => any;
  getAudioSource: () => any;
  setVideoSource: (deviceId: string) => Promise<any>;
  setAudioSource: (deviceId: string) => Promise<any>;
  videoElement: () => HTMLMediaElement;

  stream: Stream;
}
