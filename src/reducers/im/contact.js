import SEND from '../../jsons/send.json';
import { GET_USER_INFO } from "../../actions/im/userInfo";
import { WRITING_CONTACT, CONTACT_VALUE_INVALID, REWRITING_CONTACT } from '../../actions/send/contact';

const contact = (state = SEND.contact, action) => {
    switch (action.type) {
        case GET_USER_INFO:
            return Object.assign({}, state, {
                value: action.payload.userInfo.mobile,
            });
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