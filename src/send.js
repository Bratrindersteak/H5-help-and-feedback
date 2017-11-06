import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import app from './reducers/send/index';
import logger from 'redux-logger';
import IM from './components/IM/Index';
import { default as Send } from './components/Send/Index';
import './sass/im.scss';
import './sass/send.scss';

const store = createStore(
    app,
    applyMiddleware(logger)
);

ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={ IM }/>
                <Route path="/send" exact component={ Send }/>
            </Switch>
        </BrowserRouter>
    </Provider>
), document.querySelector('#app'));