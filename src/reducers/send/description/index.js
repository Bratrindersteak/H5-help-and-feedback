import { combineReducers } from 'redux';
import textarea from './textarea';
import picture from './picture';
import count from './count';

const description = combineReducers({
    textarea,
    picture,
    count,
});

export default description;