import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import store from './store/store';
import { initializeContext } from '@eventdex/core/src/hostApp';
import history from './history';
import 'react-toastify/dist/ReactToastify.css';

let hostApp = {
  abbreviation: 'vv',
  name: 'Video call vonage',
  disableMeetingSchedule: true,
  disableMinimizeVideo: true,
};

const AppLazy = React.lazy(() => import('./App'));
const App = () => (
  <Suspense fallback={<div />}>
    <AppLazy />
  </Suspense>
);

initializeContext(store, history, hostApp);

ReactDOM.render(<App />, document.getElementById('root'));
