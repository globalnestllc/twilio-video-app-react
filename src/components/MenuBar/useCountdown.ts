import React, { useState } from 'react';
import moment from 'moment';
import 'moment-timezone';

export default function useCountdown(end, zone, callback) {
  const [endTime, setEndTime] = useState<number>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [timezone, setTimeZone] = useState('');
  const [timeWarningTriggered, setTimeWarningTriggered] = useState<boolean>(false);

  window['setEndTime'] = end => {
    setEndTime(end);
    setTimeWarningTriggered(false);
  };

  React.useEffect(() => {
    console.log('TTTT effect', end, zone);

    if (end && zone && end !== '' && zone !== '') {
      zone = zone.replace(/-/g, '/');
      setTimeZone(zone);
      let endTimeNum = new Date(end.replace(/-/g, '/')).getTime();
      console.log('TTTT setEndTime', end, zone, endTimeNum);
      setEndTime(endTimeNum);
      // setCallDis('true');
    }
  }, [end, zone]);

  React.useEffect(() => {
    let timerID;
    if (end && zone) {
      timerID = setInterval(() => tick(), 1000);
    }
    return () => {
      if (timerID) {
        clearInterval(timerID);
      }
    };
  }, [remainingSeconds, endTime]);

  const tick = () => {
    console.log('TTTT tick endTime', endTime);
    if (endTime) {
      const currentTime = new Date(moment.tz(new Date(), timezone).format('MM/DD/YYYY LTS')).getTime();
      console.log('TTTT tick', endTime, currentTime);

      let diff = (endTime - currentTime) / 1000;
      setRemainingSeconds(diff);

      if (diff <= 0) {
        callback('complete');
      } else if (diff <= 2 * 60 && !timeWarningTriggered) {
        callback('last-2-minutes');
        //Don't trigger every second.
        setTimeWarningTriggered(true);
      }
    }
  };

  const getRemainingTime = () => {
    let minute = 0;
    let second = 0;
    if (remainingSeconds > 0) {
      minute = Math.abs(Math.floor(remainingSeconds / 60));
      second = Math.abs(remainingSeconds % 60);
    }

    console.log('TTTT remaining ', minute + ':' + second, '=== ', remainingSeconds);
    return { second, minute };
  };

  return { ...getRemainingTime(), remainingSeconds, timezone };
}
