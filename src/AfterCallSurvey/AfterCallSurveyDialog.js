import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogContent } from '@material-ui/core';
import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles, useTheme } from '@material-ui/core/styles';
import { urlFor_RestApi } from '@eventdex/core/src/context';
import { useWindowMessageCallback } from './useWindowMessageCallback';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    height: '80%',
    [theme.breakpoints.down('sm')]: {
      height: '100%',
    },
  },

  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
}));
const styles = theme => ({
  root: {
    margin: 0,
    padding: 0,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default function AfterCallSurveyDialog(props) {
  const classes = useStyles();
  const { open, onClose, url } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  function handleIframeMessage(message, data) {
    if (data === 'iframe_message' || message === 'iframe_message') {
      console.log('handleIframeMessage', message, data);
      onClose();
    }
  }
  useWindowMessageCallback(handleIframeMessage);

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={true}
      maxWidth={'md'}
      open={open}
      aria-labelledby="survey questions"
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle id="max-width-dialog-title" onClose={onClose}>
        {/*Please answer the following questions*/}
      </DialogTitle>

      <iframe src={url} className={classes.iframe} />
    </Dialog>
  );
}
