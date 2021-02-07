import React from 'react';

import { FormControl, Grid, MenuItem, Select, Typography } from '@material-ui/core';
import { SELECTED_AUDIO_INPUT_KEY } from '../../../constants';
import { useAudioInputDevices } from '../../../hooks/deviceHooks/deviceHooks';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import useMediaStreamTrack from '../../../vonage/useMediaStreamTrack';
import AudioLevelIndicator from '../../../vonage/AudioLevelIndicator';

export default function AudioInputList() {
  const audioInputDevices = useAudioInputDevices();
  const { localParticipant } = useVideoContext();
  const { replaceTrack, localDeviceId, mediaStreamTrack: localAudioTrack } = useMediaStreamTrack(
    localParticipant,
    'audio'
  );

  return (
    <div>
      <Typography variant="subtitle2" gutterBottom>
        Audio Input
      </Typography>
      <Grid container alignItems="center" justify="space-between">
        <div className="inputSelect">
          {audioInputDevices.length > 1 ? (
            <FormControl fullWidth>
              <Select
                onChange={e => replaceTrack(e.target.value as string)}
                value={localDeviceId || ''}
                variant="outlined"
              >
                {audioInputDevices.map(device => (
                  <MenuItem value={device.deviceId} key={device.deviceId}>
                    {device.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Typography>{localAudioTrack?.label || 'No Local Audio'}</Typography>
          )}
        </div>
        <AudioLevelIndicator participant={localParticipant} color="black" />
      </Grid>
    </div>
  );
}
