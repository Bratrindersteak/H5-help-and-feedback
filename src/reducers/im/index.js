import { combineReducers } from 'redux';
import display from './display';
import description from './description/index';
import contact from './contact';
import send from './send';
import list from './list';
import userInfo from './userInfo';

const app = combineReducers({
    display,
    description,
    contact,
    send,
    list,
    userInfo,
});

export default app;