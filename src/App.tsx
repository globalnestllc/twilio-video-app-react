import React, {Suspense} from "react";

import {CssBaseline} from "@mui/material";
import {StyledEngineProvider, ThemeProvider} from "@mui/material/styles";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
    useLocation,
    useParams,
} from "react-router-dom";
import VideoModule from "@eventdex/video";
import VonageVideo from "@eventdex/video/src/components/Vonage";
import {actionOpenVideo} from "@eventdex/video/src/store/actions";
import store from "./store/store";
import {Provider, useDispatch} from "react-redux";
import {localStorageHelper} from "@eventdex/core/src/services";
//============
import {registerModule} from "@eventdex/core";
// import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./LandingPage";
import AfterCallSurveyDialog from "./AfterCallSurvey/AfterCallSurveyDialog";
import useAppTheme from "@eventdex/common/src/hooks/useAppTheme";
import SetTestUser from "@eventdex/common/src/components/ErrorBoundaries/SetTestUser";
import "@eventdex/chat/src/components/Chat/style.scss";
import LazyComponent from "@eventdex/common/src/helpers/LazyComponent";

const Modules = LazyComponent(() => import("./EventdexModules"));

registerModule(VideoModule);

interface RoomName {
    roomName: string;
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const VideoApp = () => {
    const dispatch = useDispatch();
    const {roomName} = useParams<RoomName>();
    let query = useQuery();

    const room = {name: roomName};
    const user = {name: query.get("uname")};
    const isAdmin = query.get("admin");
    const email = query.get("email");

    if (email) {
        // @ts-ignore
        localStorageHelper.email = email;
    }

    React.useEffect(() => {
        //Just set video state open.
        let params = {isOpen: true};
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

            <AfterCallSurveyDialog roomName={roomName} />
        </React.Fragment>
    );
};

export default function AppWrapper(props) {
    const {theme} = useAppTheme("dark");
    return (
        <Provider store={store}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Router>
                        <Switch>
                            <Route exact path="/testUser" component={SetTestUser} />
                            <Route exact path="/">
                                <VideoApp />
                            </Route>
                            <Route exact={false} path="/:roomName">
                                <VideoApp />
                            </Route>
                            <Redirect to="/" />
                        </Switch>
                    </Router>
                </ThemeProvider>
            </StyledEngineProvider>
        </Provider>
    );
}
