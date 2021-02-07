import React from 'react';
import { FormControl, MenuItem, Select, Typography } from '@material-ui/core';
import { LocalVideoTrack } from 'twilio-video';
import { makeStyles } from '@material-ui/core/styles';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { useVideoInputDevices } from '../../../hooks/deviceHooks/deviceHooks';
import VideoTrack from '../../../vonage/VideoTrack';
import useMediaStreamTrack from '../../../vonage/useMediaStreamTrack';

const useStyles = makeStyles({
  preview: {
    width: '300px',
    maxHeight: '200px',
    margin: '0.5em auto',
    '& video': {
      maxHeight: '200px',
    },
  },
});

export default function VideoInputList() {
  const classes = useStyles();
  const videoInputDevices = useVideoInputDevices();
  const { localParticipant } = useVideoContext();
  const { mediaStreamTrack, localDeviceId, replaceTrack } = useMediaStreamTrack(localParticipant, 'video');

  return (
    <div>
      {mediaStreamTrack && (
        <div className={classes.preview}>
          <VideoTrack isSelected publisher={localParticipant} />
        </div>
      )}
      {videoInputDevices.length > 1 ? (
        <FormControl fullWidth>
          <Typography variant="subtitle2" gutterBottom>
            Video Input
          </Typography>
          <Select onChange={e => replaceTrack(e.target.value as string)} value={localDeviceId || ''} variant="outlined">
            {videoInputDevices.map(device => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Video Input
          </Typography>
          <Typography>{mediaStreamTrack?.label || 'No Local Video'}</Typography>
        </>
      )}
    </div>
  );
}
