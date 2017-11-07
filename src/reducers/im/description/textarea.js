import { WRITE_DESCRIPTION, UPLOAD_PIC, WRITE_CONTACT, SEND_FEEDBACK, } from '../../../actions/send/index';
import SEND from '../../../jsons/send.json';

const textarea = (state = SEND.description.textarea, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default textarea;