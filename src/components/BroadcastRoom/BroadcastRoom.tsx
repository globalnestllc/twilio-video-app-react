import React from 'react';
import ParticipantList from '../ParticipantList/ParticipantList';
import { styled } from '@material-ui/core/styles';
import MainParticipant from '../MainParticipant/MainParticipant';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import BroadcastParticipantList from './BroadcastParticipantList';

//Styles

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    // maxWidth:'150px',
    // minWidth:'150px',
    height: '150px',
  },
  broadcastMain: {
    width: '45%',
    border: '1px solid #6a323238',
    padding: '6px',
    borderRadius: '5px',
    position: 'relative',
    left: '22%',
    //  height: '400px'
  },
}));

const useStyles1 = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    maxWidth: '20%',
    minWidth: '20%',
    // height:'150px'
  },
  broadcastMain: {
    width: '45%',
    border: '1px solid #6a323238',
    padding: '6px',
    borderRadius: '5px',
    position: 'relative',
    left: '22%',
    height: '400px',
  },
  focusElement: {
    position: 'absolute',
    width: '78%',
    border: '1px solid red',
    left: '21.4%',
    height: '100%',
  },
}));

const useStyles2 = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: '100%',
    // minWidth: '20%',
    height: '150px',
  },
  broadcastMain: {
    width: '45%',
    border: '1px solid #6a323238',
    padding: '6px',
    borderRadius: '5px',
    position: 'relative',
    left: '22%',
    // height: '400px'
  },
  focusElement: {
    position: 'relative',
    width: '100%',
    border: '1px solid red',
    height: '400px',
  },
}));

const Container = styled('div')(({ theme }) => {
  const totalMobileSidebarHeight = `${theme.sidebarMobileHeight +
    theme.sidebarMobilePadding * 2 +
    theme.participantBorderWidth}px`;

  return {
    position: 'relative',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
    gridTemplateRows: '100%',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: `100%`,
      gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
    },
  };
});

export default function BroadcastRoom(props) {
  console.log(props.layoutOption);
  // const { layoutOption } = props
  let layoutOption = 'bestFit';
  const classes = useStyles();
  //   if (layoutOption == 'vericalPresentation') {
  //     classes1 = useStyles2();
  //   } else if (layoutOption == 'horizontalPresentation') {
  //     classes1 = useStyles1();
  //   } else {
  //     classes1 = useStyles();
  //   }
  return (
    <Container>
      <Grid container spacing={1}>
        <Grid xs={6}>
          <BroadcastParticipantList class={classes} />
        </Grid>
      </Grid>
      {/* <MainParticipant /> */}
      {/* <ParticipantList /> */}
    </Container>
  );
}
