export const CALCULATE = "CALCULATE";
export const ADD_TIME = "ADD_TIME";
export const LOAD_TIMES = "LOAD_TIMES";
export const CLEAR_TIMES = "CLEAR_TIMES";
export const DELETE_TIME = "DELETE_TIME";
export const DOWNLOAD_TIMES = "DOWNLOAD_TIMES";
export const RESET_CALCULATION = "@@redux-form/RESET";
export const EDIT_TIME = "@@redux-form/INITIALIZE";
export const CALCULATION_FETCHED = "@@redux-form/CHANGE";
export const TIMES_CLEANED = "TIMES_CLEANED";
export const TIMES_LOADED = "TIMES_LOADED";
export const SET_FIELD = "@@redux-form/CHANGE";
export const SAVE_PROJECT = "SAVE_PROJECT";
export const PROJECT_SAVED = "PROJECT_SAVED";
export const CREATE_PROJECT = "CREATE_PROJECT";
export const USER_SIGN_IN = "USER_SIGN_IN";
export const USER_SIGN_OUT = "USER_SIGN_OUT";
export const USER_CONNECTING = "USER_CONNECTING";
export const USER_CONNECTED = "USER_CONNECTED";
export const USER_DISCONNECTED = "USER_DISCONNECTED";
export const SYNC_STARTED = "SYNC_STARTED";
export const SYNC_DONE = "SYNC_DONE";
export const SYNC_FAILED = "SYNC_FAILED";
export const DATA_CHANGED = "DATA_CHANGED";
export const REQUEST_APPROVAL = "REQUEST_APPROVAL";
export const NAVIGATE_TO_PROJECTS = "NAVIGATE_TO_PROJECTS";
export const NAVIGATE_TO_APP = "NAVIGATE_TO_APP";
export const LOAD_PROJECTS = "LOAD_PROJECTS";
export const PROJECTS_LOADED = "PROJECTS_LOADED";
export const CURRENT_PROJECT_CHANGED = "CURRENT_PROJECT_CHANGED";
export const FILES_LOADED = "FILES_LOADED";

export function timesLoaded(times, currentProjectId) {
  return {
    type: TIMES_LOADED,
    times,
    currentProjectId
  };
}

export function calculationFetched(calculation) {
  return {
    type: CALCULATION_FETCHED,
    meta: { form: "time", field: "duration" },
    payload: calculation.duration
  };
}

export function fetchCalculation(form) {
  return {
    type: CALCULATE,
    form: form
  };
}

export function timesCleaned() {
  return {
    type: TIMES_CLEANED
  };
}

export function resetCalculation() {
  return {
    type: RESET_CALCULATION,
    meta: { form: "time" }
  };
}

export function save(time) {
  return {
    type: ADD_TIME,
    time: time
  };
}

export function loadTimes(filename) {
  return {
    type: LOAD_TIMES,
    filename
  };
}

export function clearTimes() {
  return {
    type: CLEAR_TIMES
  };
}

export function deleteTime(time) {
  return {
    type: DELETE_TIME,
    time: time
  };
}

export function downloadTimes(times) {
  return {
    type: DOWNLOAD_TIMES,
    times: times
  };
}

export function setField(field, value) {
  return {
    type: SET_FIELD,
    meta: { form: "time", field },
    payload: value
  };
}

export function editTime(time) {
  return {
    type: EDIT_TIME,
    meta: { form: "time" },
    payload: { ...time.time }
  };
}

export function saveProject(project) {
  return {
    type: SAVE_PROJECT,
    project
  };
}

export function projectSaved(project) {
  return {
    type: PROJECT_SAVED,
    project
  }
}

export function createProject(title) {
  return {
    type: CREATE_PROJECT,
    title
  }
}

export function filesLoaded(files) {
  return {
    type: FILES_LOADED,
    files
  }
}

export function userSignIn() {
  return {
    type: USER_SIGN_IN
  };
}

export function userSignOut() {
  return {
    type: USER_SIGN_OUT
  };
}

export function userConnecting() {
  return {
    type: USER_CONNECTING
  };
}

export function userConnected(user) {
  return {
    type: USER_CONNECTED,
    user: user
  };
}

export function userDisconnected() {
  return {
    type: USER_DISCONNECTED
  };
}

export function syncStarted() {
  return {
    type: SYNC_STARTED
  };
}

export function syncDone() {
  return {
    type: SYNC_DONE
  };
}

export function syncFailed(error) {
  return {
    type: SYNC_FAILED,
    error: error
  };
}

export function dataChanged(filename) {
  return {
    type: DATA_CHANGED,
    filename
  };
}

export function requestApproval(filename, username) {
  return {
    type: REQUEST_APPROVAL,
    filename,
    username
  };
}

export function navigateToProjects(history) {
  return {
    type: NAVIGATE_TO_PROJECTS,
    history
  };
}

export function navigateToApp(history, waitForNewProject) {
  return {
    type: NAVIGATE_TO_APP,
    history,
    waitForNewProject
  };
}

export function loadProjects() {
  return {
    type: LOAD_PROJECTS
  };
}

export function projectsLoaded(projects) {
  return {
    type: PROJECTS_LOADED,
    projects
  };
}

export function currentProjectChanged(project, projects) {
  return {
    type: CURRENT_PROJECT_CHANGED,
    project,
    projects
  };
}
