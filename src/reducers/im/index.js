import { combineReducers } from 'redux';
import display from './display';
import description from './description/index';
import contact from './contact';
import status from './status';
import send from './send';
import list from './list';
import userInfo from './userInfo';
import week from './week';
import nav from './nav';

const app = combineReducers({
    display,
    description,
    contact,
    status,
    send,
    list,
    userInfo,
    week,
    nav,
});

export default app;