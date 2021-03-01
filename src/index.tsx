import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Redirect, Switch, useParams, useLocation } from 'react-router-dom';
import theme from './theme';
import VideoModule, { VonageVideo, StandaloneVideoApp } from '@eventdex/video';
import store from './store/store';
import { Provider, useSelector, useDispatch } from 'react-redux';
//============
import { registerModule } from '@eventdex/core';

import { initializeContext } from '@eventdex/core/context';
import history from './history';

let hostApp = {
  abbreviation: 'vv',
  name: 'Video call vonage',
};

// const AppLazy = React.lazy(() => import('./EventdexModules'));

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
  return <VonageVideo isOpen={true} room={room} user={user} />;
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
