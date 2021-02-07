import axios from 'axios';

export const fetchUrl = meetingid => {
  // return get({url})
};

export const getScheduleStatus = (url, roomName) => {
  url = url + '?meetingid=' + roomName;
  return fetch(url).then(res => res.json());
  // return get({url})
};

const _getNewSession = roomName => {
  let options = {};
  if (roomName) {
    options.data = { slug: roomName };
  }

  return axios
    .post(`https://evendex-stack.herokuapp.com/meet/vonage/`, options)
    .then(response => {
      console.log('creating session', response.data);
      return response.data;
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        console.log('Error creating new session', 404);
      }
    });
};
export const getSession = (roomName = null, roomType, recordingOn) => {
  if (!roomName) {
    return _getNewSession();
  }

  return axios
    .get(`https://evendex-stack.herokuapp.com/meet/vonage/${roomName}`)
    .then(response => {
      console.log('getting session', response.data);
      return response.data;
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        console.log('Error getting session', 404);
        return _getNewSession(roomName);
      }
    });
};

export const getToken = (roomName, data = { default: true }, role = 'moderator') => {
  return axios
    .get(`https://evendex-stack.herokuapp.com/meet/vonage/${roomName}/get_token`, {
      params: {
        data,
        role,
      },
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log('Error getting token', error);
    });
};
