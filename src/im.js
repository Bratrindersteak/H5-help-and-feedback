import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import app from './reducers/im/index';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import IM from './containers/IM/Index';
import Send from './containers/Send/Index';
import './sass/im.scss';
import './sass/send.scss';

const store = createStore(
    app,
    applyMiddleware(thunk, logger)
);

ReactDOM.render((
    <Provider store={store}>
        <div>
            <IM />
            <Send />
        </div>
    </Provider>
), document.querySelector('#app'));