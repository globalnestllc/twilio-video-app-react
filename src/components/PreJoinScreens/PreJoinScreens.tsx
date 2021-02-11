import React, { FormEvent, useEffect, useState } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import PreflightTest from './PreflightTest/PreflightTest';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import Video from 'twilio-video';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens() {
  const { user, setUserName } = useAppState();
  const [step, setStep] = useState(Steps.roomNameStep);
  const { connect } = useVideoContext();
  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');
  const [mediaError] = useState<Error>();

  const {
    URLRoomName: _roomName,
    uName: _userName,
    eName: _eventName,
    vType: _videoType,
    recording,
    end,
    zone,
    base,
  } = useParams();

  useEffect(() => {
    if (_roomName) {
      setRoomName(_roomName);
      setName(_userName);
      if (user?.displayName) {
        setStep(Steps.deviceSelectionStep);
      }
    }
  }, [user, _userName, _roomName]);

  useEffect(() => {
    setRoomName(_roomName);
    setName(_userName);
  }, [_roomName, _userName]);

  useEffect(() => {
    if (step === Steps.roomNameStep) {
      // This is the name used in publisher object which keeps the publisher alive.
      // Set this to null to release the devices.
      setUserName(null);
    }
  }, [step]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUserName(name);
    // connect(roomName,name)
    setStep(Steps.deviceSelectionStep);
  };

  const SubContent = (
    <>
      {Video.testPreflight && <PreflightTest />}
      <MediaErrorSnackbar error={mediaError} />
    </>
  );

  return (
    <IntroContainer subContent={step === Steps.deviceSelectionStep && SubContent}>
      {step === Steps.roomNameStep && (
        <RoomNameScreen
          name={name}
          roomName={roomName}
          setName={setName}
          setRoomName={setRoomName}
          handleSubmit={handleSubmit}
        />
      )}

      {step === Steps.deviceSelectionStep && (
        <DeviceSelectionScreen name={name} roomName={roomName} setStep={setStep} />
      )}
    </IntroContainer>
  );
}
