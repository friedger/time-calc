import { combineReducers } from 'redux'

import Timelist from './timelist'
import Form from './form'
import UserProfile from './userProfile'

export default combineReducers({
  timelist: Timelist.dispatch,
  form: Form.dispatch,
  userProfile: UserProfile.dispatch
})
