import { all } from 'redux-saga/effects';

function* actionWatcher() {
  yield console.log('Get called 11');
}
export default function* rootSaga() {
  console.log('Hello saga');
  yield all([actionWatcher()]);
}
