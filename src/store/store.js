import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import rootSaga from "./saga";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import staticReducers from "./reducer";
import {combineReducers} from "redux";
import {configureAppStore} from "@eventdex/bootstrap/src/store/storeSetup";

const store = configureAppStore({}, staticReducers, rootSaga);
export default store;
