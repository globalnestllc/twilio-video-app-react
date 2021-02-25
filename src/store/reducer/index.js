import * as Actions from '../action';
import { createReducer } from '@reduxjs/toolkit';
//import { Subscriber } from '@opentok/client';

const initialState = {
  local: {
    loading: false,
    isConneted: false,
    name: 'Logged in user',
    sessionId: 'XXXXXXXXXXXXXXXXXXXXXXXX',
    token: 'XXXX-XXXXXXXXXXXX-XXXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    broadcast: {
      layoutOption: 'bestFit',
      resolution: '660*650',
      participant: [
        {
          id: 'f8e3187c-bb94-4cb2-b7d7-21282b334478',
          name: 'amit',
        },
        {
          id: '9ac562f9-59f4-43fb-afdc-0ccaac049fff',
          name: 'hasan',
        },
        {
          id: '9ac562f9-59f4-43fb-afdc-0ccaac049ff1',
          name: 'Durga',
        },
        {
          id: '9ac562f9-59f4-43fb-afdc-0ccaac049ff2',
          name: 'Gaurov',
        },
      ],
      layout: [
        {
          id: 'f8e3187c-bb94-4cb2-b7d7-21282b334478',
          layoutClassList: [],
          name: '',
          videoType: 'camera',
        },
        {
          id: '9ac562f9-59f4-43fb-afdc-0ccaac049ff1',
          layoutClassList: [],
          name: '',
          videoType: 'camera',
        },
        {
          id: '9ac562f9-59f4-43fb-afdc-0ccaac049fff',
          layoutClassList: ['focus', 'testhasan'],
          name: '',
          videoType: 'camera',
        },
        {
          id: '9ac562f9-59f4-43fb-afdc-0ccaac049ff2',
          layoutClassList: [],
          name: '',
          videoType: 'camera',
        },
      ],
    },
  },
};
console.log('Came here');

const reducer = createReducer(initialState, {
  [Actions.startCall]: (state, action) => {
    state.isConneted = true;
  },
  [Actions.updateLayoutClass]: (state, action) => {
    let layout = state.broadcast.layout;
    layout = layout.filter(data => {
      if (data.layoutClassList.indexOf('focus') > -1) {
        return data.layoutClassList.splice(data.layoutClassList.indexOf('focus'), 1);
      }
      if (data.id == action.payload) {
        return data.layoutClassList.push('focus');
      }
    });
  },
  [Actions.updateLayoutOption]: (state, action) => {},
});

export default reducer;
