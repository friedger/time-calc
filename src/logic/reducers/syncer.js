import {SYNC_STARTED, SYNC_DONE, SYNC_FAILED, DATA_CHANGED} from '../actions/actions'

export default class Syncer {
  static dispatch (state = { hasChanges: null, isSyncing: null, allSynced: null, error:null }, action) {
    if (!Syncer.instance) {
      Syncer.instance = new Syncer()
    }

    return Syncer.instance.process(state, action)
  }

  process (state, action) {
    this.state = state
    this.syncState = state.syncState || null
    this.action = action

    switch (action.type) {
      case SYNC_STARTED: return this.syncing()
      case SYNC_DONE: return this.syncDone()
      case SYNC_FAILED: return this.syncDone("error")
      case DATA_CHANGED: return this.dataChanged()
      default: return state
    }
  }

  syncing () {
    return {
      ...this.state,
      isSyncing: true
    }
  }

  syncDone (error) {
    return {
      ...this.state,
      isSyncing: false,
      hasChanges: false,
      allSaved: true,
      error: error
    }
  }

  dataChanged () {
    return {
      ...this.state,
      allSaved: false,
    }
  }
}
