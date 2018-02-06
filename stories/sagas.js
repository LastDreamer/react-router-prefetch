import { action } from '@storybook/addon-actions';
import { call, put, takeEvery } from 'redux-saga/effects';

import api from './api';
import types from './types';

function* fetchData({ payload, resolve, reject }) {
  action('Call saga')();
  try {
    const data = yield call(api, payload);

    yield put({
      type: types.DATA_SUCCESS,
      payload: data,
    });

    action('Saga resolve')();
    resolve();
  } catch (e) {
    yield put({
      type: types.DATA_FAILURE,
      payload: e,
    });

    action('Saga reject')();
    reject(e);
  }
}

function* saga() {
  yield takeEvery(types.DATA_REQUEST, fetchData);
}

export default saga;
