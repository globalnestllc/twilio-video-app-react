import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import { Box, Container, CssBaseline, Grid, Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Redirect, Route, Switch, useLocation, useParams } from 'react-router-dom';
import theme from './theme';
import VideoModule, { VonageVideo } from '@eventdex/video';
import { actionOpenVideo } from '@eventdex/video/src/store/actions';
import store from './store/store';
import { Provider, useDispatch } from 'react-redux';
import { localStorageHelper } from '@eventdex/core/context';

//============
import { registerModule } from '@eventdex/core';

import { initializeContext } from '@eventdex/core/context';
import history from './history';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventdexModules from './EventdexModules';
import CircleBackdrop from '@eventdex/common/src/components/CircleBackdrop';
import LandingPage from './LandingPage';
let hostApp = {
  abbreviation: 'vv',
  name: 'Video call vonage',
};

const ModulesLazy = React.lazy(() => import('./EventdexModules'));
const Modules = () => (
  <Suspense fallback={<div />}>
    <ModulesLazy />
  </Suspense>
);

initializeContext(store, history, hostApp);
registerModule(VideoModule);

interface RoomName {
  roomName: string;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VideoApp = () => {
  const { roomName } = useParams<RoomName>();
  const room = { name: roomName };
  let query = useQuery();
  const user = { name: query.get('uname') };
  const isAdmin = query.get('admin');
  const email = query.get('email');
  if (email) {
    localStorageHelper.email = email;
  }

  const dispatch = useDispatch();

  React.useEffect(() => {
    //Just set video state open.
    let params = { isOpen: true };
    dispatch(actionOpenVideo(params));
  }, []);

  if (!roomName) {
    return <LandingPage />;
  }

  return (
    <React.Fragment>
      <Modules />

      <VonageVideo
        isOpen={true}
        room={room}
        user={user}
        isAdmin={isAdmin}
        // modal
        // contained
      />
      <ToastContainer
        style={{ position: 'absolute', zIndex: 10000, width: 'fit-content', minWidth: 320 }}
        autoClose={30000}
      />
    </React.Fragment>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path="/">
            <VideoApp />
          </Route>
          <Route exact={false} path="/:roomName">
            <VideoApp />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
