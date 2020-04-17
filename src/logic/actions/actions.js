export const CALCULATE = 'CALCULATE';
export const ADD_TIME = 'ADD_TIME';
export const LOAD_TIMES = 'LOAD_TIMES';
export const LOAD_SHARED_TIMES = 'LOAD_SHARED_TIMES';
export const CLEAR_TIMES = 'CLEAR_TIMES';
export const DELETE_TIME = 'DELETE_TIME';
export const DOWNLOAD_TIMES = 'DOWNLOAD_TIMES';
export const RESET_CALCULATION = '@@redux-form/RESET';
export const EDIT_TIME = '@@redux-form/INITIALIZE';
export const CALCULATION_FETCHED = '@@redux-form/CHANGE';
export const TIMES_CLEANED = 'TIMES_CLEANED';
export const TIMES_LOADED = 'TIMES_LOADED';
export const SHARED_TIMESHEET_LOADED = 'SHARED_TIMESHEET_LOADED';
export const SET_FIELD = '@@redux-form/CHANGE';
export const SAVE_PROJECT = 'SAVE_PROJECT';
export const PROJECT_SAVED = 'PROJECT_SAVED';
export const CREATE_PROJECT = 'CREATE_PROJECT';
export const USER_SIGN_IN = 'USER_SIGN_IN';
export const USER_SIGN_OUT = 'USER_SIGN_OUT';
export const USER_CONNECTING = 'USER_CONNECTING';
export const USER_CONNECTED = 'USER_CONNECTED';
export const USER_DISCONNECTED = 'USER_DISCONNECTED';
export const SYNC_STARTED = 'SYNC_STARTED';
export const SYNC_DONE = 'SYNC_DONE';
export const SYNC_FAILED = 'SYNC_FAILED';
export const ARCHIVE_PROJECT = 'ARCHIVE_PROJECT';
export const UNARCHIVE_PROJECT = 'UNARCHIVE_PROJECT';
export const APPROVAL_STARTED = 'APPROVAL_STARTED';
export const APPROVAL_DONE = 'APPROVAL_DONE';
export const APPROVAL_FAILED = 'APPROVAL_FAILED';
export const DATA_CHANGED = 'DATA_CHANGED';
export const PROJECT_SETTINGS_CHANGED = 'PROJECT_SETTINGS_CHANGED';
export const REQUEST_APPROVAL = 'REQUEST_APPROVAL';
export const NAVIGATE_TO_PROJECT = 'NAVIGATE_TO_PROJECT';
export const NAVIGATE_TO_APP = 'NAVIGATE_TO_APP';
export const LOAD_PROJECTS = 'LOAD_PROJECTS';
export const PROJECTS_LOADED = 'PROJECTS_LOADED';
export const CURRENT_PROJECT_CHANGED = 'CURRENT_PROJECT_CHANGED';
export const FILES_LOADED = 'FILES_LOADED';
export const EXPORT_PROJECTS = 'EXPORT_PROJECTS';
export const CHECK_LOGIN = 'CHECK_LOGIN';

export function timesLoaded(times, currentProjectId) {
  return {
    type: TIMES_LOADED,
    times,
    currentProjectId,
  };
}

export function sharedTimesheetLoaded(timesheet, projectId) {
  return {
    type: SHARED_TIMESHEET_LOADED,
    timesheet,
    projectId,
  };
}

export function calculationFetched(calculation) {
  return {
    type: CALCULATION_FETCHED,
    meta: { form: 'time', field: 'duration' },
    payload: calculation.duration,
  };
}

export function fetchCalculation(form) {
  return {
    type: CALCULATE,
    form: form,
  };
}

export function timesCleaned() {
  return {
    type: TIMES_CLEANED,
  };
}

export function resetCalculation() {
  return {
    type: RESET_CALCULATION,
    meta: { form: 'time' },
  };
}

export function save(time, projectId) {
  time.projectId = projectId;
  return {
    type: ADD_TIME,
    time,
  };
}

export function loadSharedTimes(user, projectId, filename) {
  return {
    type: LOAD_SHARED_TIMES,
    filename,
    user,
    projectId,
  };
}

export function clearTimes() {
  return {
    type: CLEAR_TIMES,
  };
}

export function deleteTime(time) {
  return {
    type: DELETE_TIME,
    time: time,
  };
}

export function downloadTimes(times) {
  return {
    type: DOWNLOAD_TIMES,
    times: times,
  };
}

export function setField(field, value) {
  return {
    type: SET_FIELD,
    meta: { form: 'time', field },
    payload: value,
  };
}

export function editTime(time) {
  return {
    type: EDIT_TIME,
    meta: { form: 'time' },
    payload: { ...time.time },
  };
}

export function saveProject(project) {
  return {
    type: SAVE_PROJECT,
    project,
  };
}

export function projectSaved(project) {
  return {
    type: PROJECT_SAVED,
    project,
  };
}

export function createProject(title) {
  return {
    type: CREATE_PROJECT,
    title,
  };
}

export function filesLoaded(files) {
  return {
    type: FILES_LOADED,
    files,
  };
}

export function exportProjects() {
  return {
    type: EXPORT_PROJECTS,
  };
}

export function checkLogin() {
  return {
    type: CHECK_LOGIN,
  };
}

export function userSignIn() {
  return {
    type: USER_SIGN_IN,
  };
}

export function userSignOut() {
  return {
    type: USER_SIGN_OUT,
  };
}

export function userConnecting() {
  return {
    type: USER_CONNECTING,
  };
}

export function userConnected(user) {
  return {
    type: USER_CONNECTED,
    user: user,
  };
}

export function userDisconnected() {
  return {
    type: USER_DISCONNECTED,
  };
}

export function syncStarted() {
  return {
    type: SYNC_STARTED,
  };
}

export function syncDone() {
  return {
    type: SYNC_DONE,
  };
}

export function syncFailed(error) {
  return {
    type: SYNC_FAILED,
    error: error,
  };
}

export function archiveProject(project) {
  return {
    type: ARCHIVE_PROJECT,
    project,
  };
}
export function unarchiveProject(projectId) {
  return {
    type: UNARCHIVE_PROJECT,
    projectId,
  };
}
export function approvalStarted() {
  return {
    type: APPROVAL_STARTED,
  };
}

export function approvalDone(url) {
  return {
    type: APPROVAL_DONE,
    url,
  };
}

export function approvalFailed(error) {
  return {
    type: APPROVAL_FAILED,
    error: error,
  };
}

export function dataChanged(filename) {
  return {
    type: DATA_CHANGED,
    filename,
  };
}

export function projectSettingsChanged(project) {
  return {
    type: PROJECT_SETTINGS_CHANGED,
    project,
  };
}

export function requestApproval(username) {
  return {
    type: REQUEST_APPROVAL,
    username,
  };
}

export function navigateToProject(history, projectId) {
  return {
    type: NAVIGATE_TO_PROJECT,
    history,
    projectId,
  };
}

export function navigateToApp(history, waitForNewProject) {
  return {
    type: NAVIGATE_TO_APP,
    history,
    waitForNewProject,
  };
}

export function loadProjects() {
  return {
    type: LOAD_PROJECTS,
  };
}

export function projectsLoaded(projects) {
  return {
    type: PROJECTS_LOADED,
    projects,
  };
}

export function currentProjectChanged(project, projects) {
  return {
    type: CURRENT_PROJECT_CHANGED,
    project,
    projects,
  };
}
