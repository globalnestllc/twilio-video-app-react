import React from 'react';
import { Slide, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import { useAppState } from '../../state';

const useStyles = makeStyles(theme => ({
  alertRoot: {
    minWidth: 400,
  },
  message: {
    fontSize: '1.5rem',
  },
  action: {
    '& svg': {
      fontSize: '1.5rem',
    },
  },
  icon: {
    fontSize: '2rem',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
}));

function TransitionRight(props: TransitionProps) {
  return <Slide {...props} direction="right" />;
}

const Toast = () => {
  const { toast, hideToast } = useAppState();

  const handleClose = () => {
    hideToast();
  };
  const classes = useStyles();
  return (
    <Snackbar open={toast.open} autoHideDuration={15000} onClose={handleClose} TransitionComponent={TransitionRight}>
      <Alert
        variant="filled"
        severity={toast.severity}
        onClose={handleClose}
        classes={{
          root: classes.alertRoot,
          action: classes.action,
          message: classes.message,
          icon: classes.icon,
        }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
