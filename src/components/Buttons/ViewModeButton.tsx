import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Tooltip } from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton/IconButton';
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

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

export default function ViewModeButton(props: { className?: string }) {
  const classes = useStyles();
  const { viewMode, toggleViewMode } = useVideoContext();
  let gridMode = viewMode === 'grid';

  return (
    <Tooltip title={gridMode ? 'Speaker mode' : 'Gallery mode'}>
      <IconButton aria-label="toggle view mode" onClick={toggleViewMode}>
        {gridMode ? <ViewCarouselIcon /> : <ViewComfyIcon />}
      </IconButton>
    </Tooltip>
  );
}
