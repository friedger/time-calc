import { TIMES_LOADED, TIMES_CLEANED } from "../actions/actions";

export default class Timelist {
  static dispatch(state = { times: [] }, action) {
    if (!Timelist.instance) {
      Timelist.instance = new Timelist();
    }

    return Timelist.instance.process(state, action);
  }

  process(state, action) {
    this.state = state;
    this.times = state.times || [];
    this.action = action;    

    switch (action.type) {
      case TIMES_LOADED:
        return this.setTimes();
      case TIMES_CLEANED:
        return this.clearTimes();
      default:
        return state;
    }
  }

  setTimes() {
    let times;
    if (this.action.currentProjectId) {
      let currentProjectId = this.action.currentProjectId;
      times = this.action.times.filter(t => t.projectId === currentProjectId);
    } else {
      times = this.action.times;
    }

    return {
      ...this.state,
      times
    };
  }

  clearTimes() {
    return {
      ...this.state,
      times: []
    };
  }
}
