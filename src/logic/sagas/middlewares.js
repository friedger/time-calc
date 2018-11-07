import { takeLatest, takeEvery, call, put, fork } from "redux-saga/effects";
import {
  CalculationHelper,
  TimeHelper,
  StoreHelper,
  UserHelper,
  SyncHelper
} from "../helpers";
import {
  CALCULATE,
  CLEAR_TIMES,
  LOAD_TIMES,
  ADD_TIME,
  DELETE_TIME,
  DOWNLOAD_TIMES,
  USER_SIGN_IN,
  USER_SIGN_OUT,
  DATA_CHANGED,
  timesCleaned,
  calculationFetched,
  timesLoaded,
  userConnecting,
  userConnected,
  userDisconnected,
  syncStarted,
  syncDone,
  syncFailed,
  dataChanged,
  REQUEST_APPROVAL
} from "../actions/actions";

function* calculations(action) {
  const calc = yield call(CalculationHelper.fetchCalculation, action.form);
  yield put(calculationFetched(calc));
}

function* clearTimes() {
  yield call(StoreHelper.saveTimes, []);
  yield put(dataChanged());
  yield put(timesCleaned());
}

function* loadTimesFromStore() {
  const times = yield call(StoreHelper.loadTimes);
  yield put(timesLoaded(times));
}

function* addTime(action) {
  let times = yield call(StoreHelper.loadTimes);

  if (action.index !== undefined) {
    // update
    times[action.index] = action.time;
  } else {
    // create
    times.push(action.time);
  }
  try {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(action.index))
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(action.time))
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(times))
  times = TimeHelper.sortTimes(times.filter(t => t != null));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e.toString(), e);
  }

  yield call(StoreHelper.saveTimes, times);
  yield put(dataChanged());
  yield loadTimesFromStore();
}

function* deleteTime(action) {
  let times = yield call(StoreHelper.loadTimes);
  times = times.filter(t => JSON.stringify(t) !== JSON.stringify(action.time)); // TODO better use index?

  yield call(StoreHelper.saveTimes, times);
  yield put(dataChanged());
  yield loadTimesFromStore();
}

function* downloadTimes() {
  let times = yield call(StoreHelper.loadTimes);

  yield TimeHelper.downloadTimes(times);
}

function* userSignIn() {
  yield put(userConnecting());
  yield call(UserHelper.signIn);
}

function* userSignOut() {
  yield call(UserHelper.signOut);
  yield put(userDisconnected());
}

function* checkLogin() {
  if (UserHelper.isUserSignedIn()) {
    try {
      const user = UserHelper.loadUserData();
      yield put(userConnected(user));
      yield call(SyncHelper.savePubKey);
      yield call(loadTimesRemotely);
    } catch (e) {
      yield put(userDisconnected());
    }
  } else if (UserHelper.isSignInPending()) {
    try {
      const user = yield call(UserHelper.handlePendingSignIn);
      yield put(userConnected(user));
      yield call(SyncHelper.savePubKey);
      yield call(loadTimesRemotely);
    } catch (e) {
      yield put(userDisconnected());
    }
  }
}

function* startSyncing() {
  try {
    yield put(syncStarted());
    yield call(SyncHelper.sync);
    yield put(syncDone());
  } catch (e) {
    yield put(syncFailed("sync error" + e));
  }
}

function* loadTimesRemotely() {
  try {
    yield put(syncStarted());
    const times = yield call(() => SyncHelper.init(false));
    // eslint-disable-next-line no-console
    console.log(times);
    yield put(syncDone());
    yield put(timesLoaded(times));
  } catch (e) {
    yield put(syncFailed("sync error" + e));
    yield call(loadTimesFromStore);
  }
}

function * requestApproval(action) {
  yield(put(syncStarted()));
  yield call(SyncHelper.requestApproval(action.userId));
  yield(put(syncDone()));
}

export default function* rootSaga() {
  yield fork(checkLogin);
  yield takeLatest(CALCULATE, calculations);
  yield takeEvery(CLEAR_TIMES, clearTimes);
  yield takeLatest(LOAD_TIMES, loadTimesRemotely);
  yield takeEvery(ADD_TIME, addTime);
  yield takeEvery(DELETE_TIME, deleteTime);
  yield takeEvery(DOWNLOAD_TIMES, downloadTimes);
  yield takeLatest(USER_SIGN_IN, userSignIn);
  yield takeLatest(USER_SIGN_OUT, userSignOut);
  yield takeLatest(DATA_CHANGED, startSyncing);
  yield takeEvery(REQUEST_APPROVAL, requestApproval);
}
