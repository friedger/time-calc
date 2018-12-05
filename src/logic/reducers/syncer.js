import {SYNC_STARTED, SYNC_DONE, SYNC_FAILED, DATA_CHANGED, APPROVAL_STARTED, APPROVAL_FAILED, APPROVAL_DONE} from '../actions/actions';

export default class Syncer {
  static dispatch (state = { hasChanges: null, isSyncing: null, allSynced: null, error:null }, action) {
    if (!Syncer.instance) {
      Syncer.instance = new Syncer()
    }

    return Syncer.instance.process(state, action)
  }

  process (state, action) {
    this.state = state
    this.action = action

    switch (action.type) {
      case SYNC_STARTED: return this.syncing()
      case SYNC_DONE: return this.syncDone()
      case SYNC_FAILED: return this.syncDone();
      case APPROVAL_STARTED: return this.approvalStarted();
      case APPROVAL_DONE: return this.approvalDone();
      case APPROVAL_FAILED: return this.approvalFailed();
      case DATA_CHANGED: return this.dataChanged();
      default: return state
    }
  }

  syncing () {
    return {
      ...this.state,
      isSyncing: true
    }
  }

  syncDone () {
    let error = this.action.error;
    return {
      ...this.state,
      isSyncing: false,
      hasChanges: false,
      allSaved: true,
      error
    }
  }

  approvalStarted() {
    return {
      ...this.state,
      customerCopySaved: false,
      customerCopyError: null      
    }
  }

  approvalDone() {
    return {
      ...this.state,
      customerCopySaved: true,
      customerCopyError: null,
      customerCopyUrl: this.action.url
    }
  }

  approvalFailed() {
    return {
      ...this.state,
      customerCopySaved: false,
      customerCopyError: this.action.error
    }
  }

  dataChanged () {
    return {
      ...this.state,
      allSaved: false,
    }
  }
}
