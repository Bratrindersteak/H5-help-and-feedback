import { combineReducers } from 'redux';
import description from './description/index';
import contact from './contact';
import statement from './statement';
import send from './send';

const app = combineReducers({
    description,
    contact,
    statement,
    send,
});

export default app;