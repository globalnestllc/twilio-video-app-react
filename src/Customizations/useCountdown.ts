import React, { useState } from 'react';
import moment from 'moment-timezone';

export default function useCountdown(end, zone) {
  const [endTime, setEndTime] = useState<number>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [timezone, setTimeZone] = useState('');

  window['setEndTime'] = end => {
    setEndTime(end);
  };

  React.useEffect(() => {
    if (end && zone && end !== '' && zone !== '') {
      zone = zone.replace(/-/g, '/');
      setTimeZone(zone);
      let endTimeNum = new Date(end.replace(/-/g, '/')).getTime();
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
    if (endTime) {
      const currentTime = new Date(moment.tz(new Date(), timezone).format('MM/DD/YYYY LTS')).getTime();

      let diff = (endTime - currentTime) / 1000;
      setRemainingSeconds(diff);
    }
  };

  const getRemainingTime = () => {
    let minute = 0;
    let second = 0;
    if (remainingSeconds > 0) {
      minute = Math.abs(Math.floor(remainingSeconds / 60));
      second = Math.abs(remainingSeconds % 60);
    }
    return { second, minute };
  };

  return { ...getRemainingTime(), remainingSeconds, timezone };
}
