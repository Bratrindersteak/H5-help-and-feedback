import { combineReducers } from 'redux';
import display from './display';
import description from './description/index';
import contact from './contact';
import statement from './statement';
import send from './send';

const app = combineReducers({
    display,
    description,
    contact,
    statement,
    send,
});

export default app;