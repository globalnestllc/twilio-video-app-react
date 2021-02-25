import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootSaga from './saga';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import staticReducers from './reducer';
import { combineReducers } from 'redux';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware({
  onError: (error, sagaStack) => {
    console.error('SAGA ERROR:', error, sagaStack);
  },
});

// Configure the store
export function configureAppStore(initialState) {
  const store = configureStore({
    reducer: staticReducers,
    middleware: [...getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }), sagaMiddleware, logger],
    initialState,
  });

  // Add a dictionary to keep track of the registered async reducers
  store.asyncReducers = {};

  // Create an inject reducer function
  // This function adds the async reducer, and creates a new combined reducer
  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer;
    store.replaceReducer(createReducer(store.asyncReducers));
  };

  // Add injectSaga method to our store
  store.injectSaga = createSagaInjector(sagaMiddleware.run, rootSaga);

  // Return the modified store
  return store;
}

function createSagaInjector(runSaga, rootSaga) {
  // Create a dictionary to keep track of injected sagas
  const injectedSagas = new Map();

  const isInjected = key => injectedSagas.has(key);

  const injectSaga = (key, saga) => {
    // We won't run saga if it is already injected
    if (isInjected(key)) return;

    // Sagas return task when they executed, which can be used
    // to cancel them
    const task = runSaga(saga);

    // Save the task if we want to cancel it in the future
    injectedSagas.set(key, task);
  };

  // Inject the root saga as it a staticlly loaded file,
  injectSaga('root', rootSaga);

  return injectSaga;
}

function createReducer(asyncReducers) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });
}

const store = configureAppStore();
export default store;
