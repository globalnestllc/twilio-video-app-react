import React, {Suspense} from "react";
import ReactDOM from "react-dom";
import store from "./store/store";
import {initializeContext} from "@eventdex/core/src/hostApp";
import "react-toastify/dist/ReactToastify.css";
import history from "@eventdex/bootstrap/src/hostConfig/history";
import * as Sentry from "@sentry/react";
import {BrowserTracing} from "@sentry/tracing";

let hostApp = {
    abbreviation: "vv",
    name: "Video call vonage",
    disableMeetingSchedule: true,
    disableMinimizeVideo: true,
    blockJoiningMeetingBeforeTime: true,
};

Sentry.init({
    dsn: "https://e6731dcbe93d48aa9a55245a60bd16b3@o1385356.ingest.sentry.io/6712420",
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.2,
});

const AppLazy = React.lazy(() => import("./App"));
const App = () => (
    <Suspense fallback={<div />}>
        <AppLazy />
    </Suspense>
);

initializeContext(store, history, hostApp);

ReactDOM.render(<App />, document.getElementById("root"));
