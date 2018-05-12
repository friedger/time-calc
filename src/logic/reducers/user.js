import {USER_CONNECTING, USER_CONNECTED, USER_DISCONNECTED} from '../actions/actions'

export default class User {
  static dispatch (state = { user: null }, action) {
    if (!User.instance) {
      User.instance = new User()
    }

    return User.instance.process(state, action)
  }

  process (state, action) {
    this.state = state
    this.user = state.user || null
    this.action = action

    switch (action.type) {
      case USER_CONNECTING: return this.userConnecting()
      case USER_CONNECTED: return this.userConnected()
      case USER_DISCONNECTED: return this.userDisconnected()
      default: return state
    }
  }

  userConnecting () {
    return {
      ...this.state,
      user: null,
      userMessage: "Connecting"
    }
  }
  userConnected () {
    return {
      ...this.state,
      user: this.action.user,
      userMessage: null
    }
  }

  userDisconnected () {
    return {
      ...this.state,
      user: null
      userMessage: this.action.error ? this.action.error : null
    }
  }
}
