import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { enableBatching } from 'redux-batched-actions';
import Timelist from './timelist';
import UserProfile from './userProfile';
import Syncer from './syncer';
import ProjectList from './projectlist';
import SharedTimesheet from './sharedtimesheet';

export default combineReducers({
  projectlist: ProjectList.dispatch,
  timelist: Timelist.dispatch,
  form: enableBatching(formReducer),
  userProfile: UserProfile.dispatch,
  syncState: Syncer.dispatch,
  sharedTimesheet: SharedTimesheet.dispatch,
});
