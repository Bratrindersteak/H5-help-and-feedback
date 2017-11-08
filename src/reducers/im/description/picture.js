import { WRITE_DESCRIPTION, UPLOAD_PIC, WRITE_CONTACT, SEND_FEEDBACK, } from '../../../actions/send/send';
import SEND from '../../../jsons/send.json';

const picture = (state = SEND.description.picture, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default picture;