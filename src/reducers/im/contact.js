import SEND from '../../jsons/send.json';
import { WRITE_CONTACT } from '../../actions/send/contact';

const contact = (state = SEND.contact, action) => {
    switch (action.type) {
        case WRITE_CONTACT:
            return Object.assign({}, state, {
                value: action.payload.value,
            });
        default:
            return state;
    }
};

export default contact;