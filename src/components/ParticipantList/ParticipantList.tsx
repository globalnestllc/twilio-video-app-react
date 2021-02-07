import React from 'react';
import clsx from 'clsx';
import Participant from '../Participant/Participant';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import VideoTrack from '../../vonage/VideoTrack';
import useMainParticipant from '../../hooks/useMainParticipant/useMainParticipant';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';

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

export default function ParticipantList() {
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
  // if (activeCameraSubscribers === 0) return null; // Don't render this component if there are no remote participants.

  // @ts-ignore
  // let participants = connections.map(c => c).filter(connection => !connection.id.includes(".tokbox.com"))
  let participants = [...publishers, ...subscribers];
  // @ts-ignore
  console.log('Selected: participant list', participants);

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

          console.log('Selected: participant list hide?', hideParticipant, participant);
          if (hideParticipant) {
            return null;
          }

          return (
            <Participant
              key={participant.id}
              participant={participant}
              isLocalParticipant={isLocalParticipant}
              isSelected={isSelected}
              onClick={() => {
                setSelectedParticipant(participant);
              }}
            />
          );
        })}
      </div>
    </aside>
  );
}
