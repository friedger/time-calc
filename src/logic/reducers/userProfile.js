import { USER_CONNECTING, USER_CONNECTED, USER_DISCONNECTED } from '../actions/actions';

export default class UserProfile {
  static dispatch(state = { user: null, userMessage: null }, action) {
    if (!UserProfile.instance) {
      UserProfile.instance = new UserProfile();
    }

    return UserProfile.instance.process(state, action);
  }

  process(state, action) {
    this.state = state;
    this.user = state.user || null;
    this.action = action;

    switch (action.type) {
      case USER_CONNECTING:
        return this.userConnecting();
      case USER_CONNECTED:
        return this.userConnected();
      case USER_DISCONNECTED:
        return this.userDisconnected();
      default:
        return state;
    }
  }

  userConnecting() {
    return {
      ...this.state,
      user: null,
      userMessage: 'Connecting',
    };
  }
  userConnected() {
    return {
      ...this.state,
      user: this.action.user,
      userMessage: null,
    };
  }

  userDisconnected() {
    return {
      ...this.state,
      user: null,
      userMessage: this.action.error ? this.action.error : null,
    };
  }
}
