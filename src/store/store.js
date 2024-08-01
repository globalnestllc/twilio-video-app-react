import rootSaga from "./saga";
import staticReducers from "./reducer";
import {configureAppStore} from "@eventdex/bootstrap/src/store/storeSetup";

const store = configureAppStore({}, staticReducers, rootSaga);
export default store;
