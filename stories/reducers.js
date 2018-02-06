import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';

export default combineReducers({
  loadingBar: loadingBarReducer,
});
