import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import {enableBatching} from 'redux-batched-actions'
import Timelist from './timelist'
import UserProfile from './userProfile'
import Syncer from './syncer'

export default combineReducers({
  timelist: Timelist.dispatch,
  form: enableBatching(formReducer),
  userProfile: UserProfile.dispatch,
  syncState: Syncer.dispatch
})
