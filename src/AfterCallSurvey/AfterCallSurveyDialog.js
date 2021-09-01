import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogContent } from '@material-ui/core';
import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import { urlFor_RestApi } from '@eventdex/core/src/context';
import { useWindowMessageCallback } from './useWindowMessageCallback';

const useStyles = makeStyles({
  dialogPaper: {
    height: '80%',
  },
  dialogContent: {
    textAlign: 'center',
  },
});
const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
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
  // const [isOpen,setIsOpen]=useState(true);
  const { open, onClose, url } = props;
  //
  // React.useEffect(()=>{
  //
  // },[propsOpen])
  //
  // const open = propsOpen && isOpen;

  function handleIframeMessage(message, data) {
    if (data === 'iframe_message' || message === 'iframe_message') {
      console.log('handleIframeMessage', message, data);
      onClose();
    }
  }
  useWindowMessageCallback(handleIframeMessage);

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'md'}
      open={open}
      // onClose={handleClose}
      aria-labelledby="survey questions"
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle id="max-width-dialog-title" onClose={onClose}>
        Please answer the following questions
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <iframe src={url} width={'80%'} height={'100%'} style={{ border: 'none' }} />
      </DialogContent>
    </Dialog>
  );
}
