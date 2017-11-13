import SEND from '../../jsons/send.json';
import { WRITING_CONTACT, CONTACT_VALUE_INVALID, REWRITING_CONTACT } from '../../actions/send/contact';

const contact = (state = SEND.contact, action) => {
    switch (action.type) {
        case WRITING_CONTACT:
            return Object.assign({}, state, {
                value: action.payload.value,
            });
        case CONTACT_VALUE_INVALID:
            return Object.assign({}, state, {
                value: '请填写正确的电话/QQ',
                color: '#ff382e',
            });
        case REWRITING_CONTACT:
            return Object.assign({}, state, {
                value: '',
                color: '',
            });
        default:
            return state;
    }
};

export default contact;