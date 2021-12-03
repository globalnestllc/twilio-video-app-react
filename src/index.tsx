import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Redirect, Route, Switch, useLocation, useParams } from 'react-router-dom';
import theme from './theme';
import VideoModule, { VonageVideo } from '@eventdex/video';
import { actionOpenVideo } from '@eventdex/video/src/store/actions';
import store from './store/store';
import { Provider, useDispatch } from 'react-redux';
import { initializeContext, localStorageHelper } from '@eventdex/core/context';
//============
import { registerModule } from '@eventdex/core';
import history from './history';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './LandingPage';
import AfterCallSurveyDialog from './AfterCallSurvey/AfterCallSurveyDialog';

let hostApp = {
  abbreviation: 'vv',
  name: 'Video call vonage',
  disableMeetingSchedule: true,
  disableMinimizeVideo: true,
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
  const dispatch = useDispatch();
  const { roomName } = useParams<RoomName>();
  let query = useQuery();

  const room = { name: roomName };
  const user = { name: query.get('uname') };
  const isAdmin = query.get('admin');
  const email = query.get('email');

  if (email) {
    localStorageHelper.email = email;
  }

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

      <AfterCallSurveyDialog roomName={roomName} />
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
