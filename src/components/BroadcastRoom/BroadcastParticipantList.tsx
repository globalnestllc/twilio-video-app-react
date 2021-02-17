import React from 'react';
import clsx from 'clsx';
import Participant from '../Participant/Participant';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import VideoTrack from '../../vonage/VideoTrack';
import useMainParticipant from '../../hooks/useMainParticipant/useMainParticipant';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: '2em',
      overflowY: 'auto',
      background: 'rgb(79, 83, 85)',
      gridArea: '1 / 2 / 1 / 3',
      zIndex: 5,
      [theme.breakpoints.down('sm')]: {
        gridArea: '2 / 1 / 3 / 3',
        overflowY: 'initial',
        overflowX: 'auto',
        display: 'flex',
        padding: `${theme.sidebarMobilePadding}px`,
      },
    },
    transparentBackground: {
      background: 'transparent',
    },
    scrollContainer: {
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
      },
    },
  })
);

export default function BroadcastParticipantList(props) {
  const { layout, focus, size, data } = props;
  const classes = useStyles();
  // const {
  //   room: { localParticipant },
  // } = useVideoContext();
  // const participants = useParticipants();
  const { selectedParticipant, setSelectedParticipant } = useSelectedParticipant();
  // const screenShareParticipant = useScreenShareParticipant();
  const mainParticipant = useMainParticipant();
  // const isRemoteParticipantScreenSharing = screenShareParticipant && screenShareParticipant !== localParticipant;

  const { localParticipant, publishers, subscribers, viewingSharedScreen } = useVideoContext();

  // @ts-ignore
  // let participants = connections.map(c => c).filter(connection => !connection.id.includes(".tokbox.com"))
  let participants = [...publishers, ...subscribers];
  console.log('all participants', participants);
  // @ts-ignore
  return (
    <aside
      className={clsx(classes.container, {
        [classes.transparentBackground]: !viewingSharedScreen,
      })}
    >
      <div className={classes.scrollContainer}>
        {participants.map(participant => {
          const isSelected = participant === selectedParticipant;
          const hideParticipant = participant === mainParticipant && !isSelected; //&& participant !== screenShareParticipant ;
          const isLocalParticipant = participant === localParticipant;

          if (hideParticipant) {
            return (
              <Grid xs={6} key={participant.id} item>
                <div className={props.class.focusElement}>{participant.name}</div>
              </Grid>
            );
          }

          return (
            <Grid xs={6} item key={participant.id}>
              <Participant
                key={participant.id}
                participant={participant}
                isLocalParticipant={isLocalParticipant}
                isSelected={isSelected}
                onClick={() => {
                  setSelectedParticipant(participant);
                }}
              />
            </Grid>
          );
        })}
      </div>
    </aside>
  );
}
