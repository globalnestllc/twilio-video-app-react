import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Tooltip } from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton/IconButton';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import PeopleIcon from '@material-ui/icons/People';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#600101',
      },
    },
  })
);

export default function ToggleParticipantsOpen(props) {
  const classes = useStyles();
  const { participantsOpen, setParticipantsOpen } = useVideoContext();

  if (props.hideWhenOpen && participantsOpen) {
    return null;
  }
  return (
    <Tooltip title="Participants">
      <IconButton
        aria-label={participantsOpen ? 'close participant list' : 'open participant list'}
        onClick={() => setParticipantsOpen(participantsOpen => !participantsOpen)}
      >
        {participantsOpen ? <ChevronRightIcon /> : <PeopleIcon />}
      </IconButton>
    </Tooltip>
  );
}
