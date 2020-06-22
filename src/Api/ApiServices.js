import axios from 'axios';
import { get, post } from './request';

export const fetchUrl = meetingid => {
  // return get({url})
};

export const getScheduleStatus = (url, roomName) => {
  url = url + '?meetingid=' + roomName;
  return fetch(url).then(res => res.json());
  // return get({url})
};
