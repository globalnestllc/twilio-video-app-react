import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import logoLandscape from '@eventdex/assets/images/logo-landscape.png';

export default function LandingPage() {
  return (
    <Grid
      container
      direction={'column'}
      justify={'space-around'}
      alignItems={'center'}
      style={{ maxHeight: '500px', height: '100%' }}
    >
      <img src={logoLandscape} />
      <Typography variant={'h3'}> Eventdex video conferencing </Typography>
      <Typography variant={'body1'}> Please use the link provided to join meeting.</Typography>
    </Grid>
  );
}
