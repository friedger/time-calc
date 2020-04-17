import { SHARED_TIMESHEET_LOADED } from '../actions/actions';

export default class SharedTimesheet {
  static dispatch(state = { times: [] }, action) {
    if (!SharedTimesheet.instance) {
      SharedTimesheet.instance = new SharedTimesheet();
    }

    return SharedTimesheet.instance.process(state, action);
  }

  process(state, action) {
    this.state = state;
    this.action = action;

    switch (action.type) {
      case SHARED_TIMESHEET_LOADED:
        return this.setTimesheet();
      default:
        return state;
    }
  }

  setTimesheet() {
    const timesheet = this.action.timesheet;
    let times = timesheet.times.filter(t => t != null);
    let owner = timesheet.owner;
    let project;
    if (timesheet.project) {
      project = timesheet.project;
    } else {
      if (this.action.projectId) {
        let id = this.action.projectId;
        project = { id, title: 'Unnamed' };
      } else {
        project = { title: 'Unnamed' };
      }
    }
    return {
      ...this.state,
      project,
      times,
      owner,
    };
  }
}
