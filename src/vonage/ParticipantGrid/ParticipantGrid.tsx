import React from 'react';
import { styled } from '@material-ui/core/styles';
import clsx from 'clsx';
import './ParticipantGrid.scss';
import useSelectedParticipant from '../../components/VideoProvider/useSelectedParticipant/useSelectedParticipant';
import Participant from '../../components/Participant/Participant';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

const Container = styled('aside')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '0.5em',
  [theme.breakpoints.down('xs')]: {
    overflowY: 'initial',
    overflowX: 'auto',
    padding: 0,
    display: 'flex',
  },
}));

function ParticipantRow(props) {
  const { row, cellCount } = props;
  let flexBasis = 100 / cellCount + '%';

  return (
    <div className={'row'}>
      {row.map(participant => {
        return <ParticipantCell key={`cell-${participant.id}`} participant={participant} flexBasis={flexBasis} />;
      })}
    </div>
  );
}

function ParticipantCell(props) {
  const { participant, flexBasis, length } = props;
  const { selectedParticipant, setSelectedParticipant } = useSelectedParticipant();

  return (
    <div className={clsx('cell', length === 2 && 'half-height')} style={{ flexBasis }}>
      <Participant
        key={participant.sid}
        participant={participant}
        isSelected={selectedParticipant === participant}
        onClick={() => setSelectedParticipant(participant)}
      />
    </div>
  );
}

export default function ParticipantGrid(props) {
  const { publishers, subscribers, localParticipant } = useVideoContext();
  let participants = [...publishers, ...subscribers];
  const { minColCount = 4 } = props;
  React.useEffect(() => {
    console.log('ParticipantGrid mounted');
  }, []);

  const [mul, setMul] = React.useState(0);
  // @ts-ignore
  window.mul = setMul;

  const PGrid = () => {
    for (let i = 0; i < mul; i++) {
      participants.push(localParticipant);
    }

    let length = participants.length;
    let balancedColCount = Math.ceil(Math.sqrt(length));

    let colCount = Math.min(length, Math.max(minColCount, balancedColCount));
    let rowCount = Math.ceil(length / colCount);

    let rows = [];
    for (let r = 0; r < rowCount; r++) {
      let row = [];
      for (let c = 0; c < colCount; c++) {
        let index = c + r * colCount;
        if (index < participants.length) {
          row.push(participants[index]);
        }
      }
      rows.push(row);
    }

    let rowIndex = 0;
    return rows.map(row => {
      rowIndex++;
      return <ParticipantRow key={`row-${rowIndex}`} row={row} cellCount={colCount} />;
    });
  };

  return (
    <Container>
      {props.overlayMessage}
      {PGrid()}
    </Container>
  );
}
