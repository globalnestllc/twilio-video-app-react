import React from 'react';

const printRemainingTime = (time, prefix) => {
  if (time.hour <= 0 && time.second <= 0 && time.minute <= 0) {
    return '';
  }

  let parts = [];

  let minute = time.minute < 10 ? `0${time.minute}` : time.minute;
  let second = time.second < 10 ? `0${time.second}` : time.second;

  time.hour && parts.push(time.hour);
  (time.hour || time.minute) && parts.push(minute);
  parts.push(second);

  return `${prefix} ${parts.join(':')}`;
};

export default function RemainingTime(props) {
  const { timeToStart, timeToEnd } = props;

  let remainingTimeText = '';
  if (timeToStart.remainingSeconds > 0) {
    remainingTimeText = printRemainingTime(timeToStart, 'Meeting Starts in:');
  } else {
    remainingTimeText = printRemainingTime(timeToEnd, 'Time left :');
  }

  return <div>{remainingTimeText}</div>;
}
