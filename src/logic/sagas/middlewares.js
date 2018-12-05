import { takeLatest, takeEvery, call, put, fork } from "redux-saga/effects";
import {
  CalculationHelper,
  TimeHelper,
  StoreHelper,
  UserHelper,
  SyncHelper,
  ProjectHelper,
  uuid
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
  LOAD_PROJECTS,
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
  projectsLoaded,
  REQUEST_APPROVAL,
  NAVIGATE_TO_PROJECTS,
  NAVIGATE_TO_APP,
  currentProjectChanged,
  SAVE_PROJECT,
  CREATE_PROJECT,
  projectSaved,
  filesLoaded,
  approvalStarted,
  approvalDone,
  approvalFailed,
  LOAD_SHARED_TIMES
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
  const project = yield ProjectHelper.loadCurrentProject();
  yield put(timesLoaded(times, project.id));
}

function* addTime(action) {
  let times = yield call(StoreHelper.loadTimes);
  if (!action.time.id) {
    action.time.id = uuid();
  }

  if (!action.time.projectId) {
    let project = yield call(ProjectHelper.loadCurrentProject);
    action.time.projectId = project.id;
  }

  let index = times.findIndex(value => {
    return action.time.id === value.id;
  });

  if (index >= 0) {
    // update
    times[index] = action.time;
  } else {
    // create
    times.push(action.time);
  }
  try {
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

function afterLogin(user) {
  return function*() {
    yield put(userConnected(user));
    yield call(SyncHelper.savePubKey);
    yield call(loadTimesRemotely);
    yield call(loadProjectsRemotely);
  };
}

function* checkLogin() {
  if (UserHelper.isUserSignedIn()) {
    try {
      const user = UserHelper.loadUserData();
      yield call(afterLogin(user));
    } catch (e) {
      yield put(userDisconnected());
    }
  } else if (UserHelper.isSignInPending()) {
    try {
      const user = yield call(UserHelper.handlePendingSignIn);
      yield call(afterLogin(user));
    } catch (e) {
      yield put(userDisconnected());
    }
  } else {
    yield put(syncStarted());
    const project = yield call(ProjectHelper.loadCurrentProject);
    const projects = yield call(ProjectHelper.loadProjects);
    yield put(currentProjectChanged(project, projects));
    yield call(loadTimesFromStore);
    yield put(syncDone());
  }
}

function* startSyncing() {
  try {
    yield put(syncStarted());
    const project = yield call(ProjectHelper.loadCurrentProject);
    yield call(() => SyncHelper.sync(project.id + "/" + project.filename));
    yield put(syncDone());
  } catch (e) {
    yield put(syncFailed("sync error" + e));
  }
}

function* loadSharedTimesRemotely(action) {
  try {
    yield put(syncStarted());

    let times = yield call(() =>
        SyncHelper.load(action.projectId + "/" + action.filename, action.user)
      );
    if (!times || times.length == 0) {
      yield put(syncFailed("times not found"));    
    } else {
      yield put(syncDone());
      yield put(timesLoaded(times, action.projectId));
    }
  } catch (e) {
    yield put(syncFailed("sync error" + e));    
  }
}

function* loadTimesRemotely() {
  try {
    yield put(syncStarted());
    const oldProjects = yield call(ProjectHelper.loadProjects);
    const project = yield call(ProjectHelper.loadCurrentProject);
    const projects = yield call(ProjectHelper.loadProjects);
    yield put(currentProjectChanged(project, projects));

    let times;
    if (oldProjects.length == projects.length) {
      // project already existed
      times = yield call(() =>
        SyncHelper.load(project.id + "/" + project.filename, project.owner)
      );
      if (!times) {
        yield call(loadTimesFromStore);
        yield put(syncFailed("no remote file"));
        return;
      }
    } else {
      // new project
      SyncHelper.sync(project.id + "/" + project.filename);
      times = [];
    }
    yield put(syncDone());
    yield put(timesLoaded(times, project.id));
  } catch (e) {
    yield put(syncFailed("sync error" + e));
    yield call(loadTimesFromStore);
  }
}

function* requestApproval(action) {
  yield put(approvalStarted());
  const project = yield call(ProjectHelper.loadCurrentProject);
  var username = action.username;
  if (!username) {
    if (project.customer) {
      username = project.customer;
    }
  }
  if (username) {
    const url = yield call(
      SyncHelper.requestApproval(project.id + "/" + project.filename, username)
    );    
    yield put(approvalDone(url));
  } else {
    yield put(approvalFailed("no username"));
  }
}

function* navigateToProjects(action) {
  yield action.history.push("/projects");
}

function* navigateToApp(action) {
  try {
    yield action.history.push("/app");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

function* loadProjectsRemotely() {
  try {
    yield put(syncStarted());
    const projects = yield call(ProjectHelper.loadProjects);
    yield put(syncDone());
    yield put(projectsLoaded(projects));
    const files = yield call(SyncHelper.allFiles);
    yield put(filesLoaded(files));
  } catch (e) {
    yield put(syncFailed("projects sync error" + e));
  }
}

function* saveProject(action) {
  try {
    yield put(syncStarted());
    yield call(() => ProjectHelper.saveCurrentProject(action.project));
    yield put(syncDone());
    yield put(projectSaved(action.project));
    yield put(currentProjectChanged(action.project));
  } catch (e) {
    yield put(syncFailed("save project failed" + e));
  }
}

function* createProject(action) {
  const projects = yield ProjectHelper.loadProjects();
  const project = yield call(() =>
    ProjectHelper.createProject(projects, action.title)
  );
  yield call(() => ProjectHelper.saveCurrentProject(project));
  yield put(projectSaved(action.project));
  yield put(currentProjectChanged(project));
}

export default function* rootSaga() {
  yield fork(checkLogin);
  yield takeLatest(CALCULATE, calculations);
  yield takeEvery(CLEAR_TIMES, clearTimes);
  yield takeLatest(LOAD_TIMES, loadTimesRemotely);
  yield takeLatest(LOAD_SHARED_TIMES, loadSharedTimesRemotely);
  yield takeEvery(ADD_TIME, addTime);
  yield takeEvery(DELETE_TIME, deleteTime);
  yield takeEvery(DOWNLOAD_TIMES, downloadTimes);
  yield takeLatest(USER_SIGN_IN, userSignIn);
  yield takeLatest(USER_SIGN_OUT, userSignOut);
  yield takeLatest(DATA_CHANGED, startSyncing);
  yield takeEvery(REQUEST_APPROVAL, requestApproval);
  yield takeLatest(NAVIGATE_TO_PROJECTS, navigateToProjects);
  yield takeLatest(NAVIGATE_TO_APP, navigateToApp);
  yield takeLatest(LOAD_PROJECTS, loadProjectsRemotely);
  yield takeLatest(SAVE_PROJECT, saveProject);
  yield takeLatest(CREATE_PROJECT, createProject);
}
