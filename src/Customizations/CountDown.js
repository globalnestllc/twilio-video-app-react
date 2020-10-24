import React from 'react';
import useCountdown from './useCountdown';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyle = makeStyles(theme => ({
  timeCounter: {
    height: '50px',
    left: 0,
    right: 0,
    margin: 'auto',
    maxWidth: '400px',
    textAlign: 'center',
    position: 'absolute',
    borderRadius: '5px',
    color: '#fff',
    background: '#0006',
    fontSize: '1.1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: '1s',
    [theme.breakpoints.up('xs')]: {
      bottom: `${theme.footerHeight + 5}px`,
      top: 'auto',
    },
    [theme.breakpoints.down('sm')]: {
      top: `${theme.mobileTopBarHeight + 30}px`,
      bottom: 'auto',
    },
  },
  aboutToEnd: {
    backgroundColor: theme.palette.error.main,
  },
}));

export default function CountDown(props) {
  const { zone, end, onCompleted } = props;
  const [aboutToEnd, setAboutToEnd] = React.useState(false);
  const classes = useStyle();

  const { second, minute, timezone, remainingSeconds } = useCountdown(end, zone);

  React.useEffect(() => {
    if (remainingSeconds <= 60 * 2) {
      setAboutToEnd(true);
    } else {
      setAboutToEnd(false);
    }
    if (remainingSeconds < 0) {
      onCompleted();
    }
  }, [remainingSeconds]);

  return (
    <div className={clsx(classes.timeCounter, aboutToEnd && classes.aboutToEnd)}>
      <h3>
        Time left : {minute}:{second < 10 ? `0${second}` : second}
      </h3>
    </div>
  );
}
