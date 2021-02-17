import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonEnd: {
      background: theme.brand,
      color: 'white',
      marginRight: '10px',
      '&:hover': {
        background: '#600101',
        color: 'white',
      },
    },
    buttonStart: {
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
      marginRight: '10px',
    },
  })
);

export default function StartBroadCast(props: { className?: string }) {
  const classes = useStyles();
  const { startBroadCast, broadcast, stopBroadcast } = useVideoContext();
  console.log('test ..', useVideoContext());

  return (
    <>
      {!broadcast && (
        <Button
          onClick={startBroadCast}
          variant="outlined"
          color="primary"
          className={clsx(classes.buttonStart, props.className)}
          data-cy-disconnect
        >
          Start Broadcast
        </Button>
      )}
      {broadcast && (
        <Button onClick={stopBroadcast} className={clsx(classes.buttonEnd, props.className)} data-cy-disconnect>
          Stop Broadcast
        </Button>
      )}
    </>
  );
}
