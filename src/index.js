import React from 'react';
import {render} from 'react-dom';
import { AppContainer } from 'react-hot-loader'
import './index.css';
import App from './router';
import registerServiceWorker from './registerServiceWorker'
import initSubscriber from 'redux-subscriber';
import api from 'services/api';
import {history, store, reloadSaga} from 'store'
import moment from 'moment'
import _ from 'lodash'

moment.locale('zh-CN')

JSON.safeParse = function (data, defaultValue = []) {
  return _.isEmpty(data) ? defaultValue : JSON.parse(data)
}

api.init(store) // 将store注入给api
export const subscribe = initSubscriber(store);

render(
  <AppContainer>
    <App store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);


if (module.hot) {
  module.hot.accept('./router', () => {
    const NextRoot = require('./router'); // eslint-disable-line global-require
    console.log('###### hot load #######')
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });

  module.hot.accept(() => {
    const newYieldedSagas = require('./sagas').default
    reloadSaga(newYieldedSagas)
  })
}

registerServiceWorker()
