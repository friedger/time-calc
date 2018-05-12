export const CALCULATE = 'CALCULATE'
export const ADD_TIME = 'ADD_TIME'
export const LOAD_TIMES = 'LOAD_TIMES'
export const CLEAR_TIMES = 'CLEAR_TIMES'
export const DELETE_TIME = 'DELETE_TIME'
export const DOWNLOAD_TIMES = 'DOWNLOAD_TIMES'
export const RESET_CALCULATION = 'RESET_CALCULATION'
export const EDIT_TIME = 'EDIT_TIME'
export const CALCULATION_FETCHED = 'CALCULATION_FETCHED'
export const TIMES_CLEANED = 'TIMES_CLEANED'
export const TIMES_LOADED = 'TIMES_LOADED'
export const USER_SIGN_IN = 'USER_SIGN_IN'
export const USER_SIGN_OUT = 'USER_SIGN_OUT'
export const USER_CONNECTING = 'USER_CONNECTING'
export const USER_CONNECTED = 'USER_CONNECTED'
export const USER_DISCONNECTED = 'USER_DISCONNECTED'
export const SYNC_STARTED = "SYNC_STARTED"
export const SYNC_DONE = "SYNC_DONE"
export const SYNC_FAILED = "SYNC_FAILED"

export function timesLoaded (times) {
  return {
    type: TIMES_LOADED,
    times: times
  }
}

export function calculationFetched (calculation) {
  return {
    type: CALCULATION_FETCHED,
    calculation: calculation
  }
}

export function fetchCalculation (form) {
  return {
    type: CALCULATE,
    form: form
  }
}

export function timesCleaned () {
  return {
    type: TIMES_CLEANED
  }
}

export function resetCalculation () {
  return {
    type: RESET_CALCULATION
  }
}

export function save (time, index) {
  return {
    type: ADD_TIME,
    time: time,
    index: index
  }
}

export function loadTimes () {
  return {
    type: LOAD_TIMES
  }
}

export function clearTimes () {
  return {
    type: CLEAR_TIMES
  }
}

export function deleteTime (time) {
  return {
    type: DELETE_TIME,
    time: time
  }
}

export function downloadTimes (times) {
  return {
    type: DOWNLOAD_TIMES,
    times: times
  }
}

export function editTime (time) {
  return {
    type: EDIT_TIME,
    time: time
  }
}

export function userSignIn() {
  return {
    type: USER_SIGN_IN
  }
}


export function userSignOut() {
  return {
    type: USER_SIGN_OUT
  }
}

export function userConnecting() {
  return {
    type: USER_CONNECTING
  }
}

export function userConnected(profile) {
  return {
    type: USER_CONNECTED,
    profile: profile
  }
}

export function userDisconnected() {
  return {
    type: USER_DISCONNECTED
  }
}

export function syncStarted() {
  return {
    type: SYNC_STARTED
  }
}

export function syncDone() {
  return {
    type: SYNC_DONE
  }
}

export function syncFailed(error) {
  return {
    type: SYNC_FAILED,
    error: error
  }
}
