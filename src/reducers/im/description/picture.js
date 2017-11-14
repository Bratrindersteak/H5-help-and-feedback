import { UPLOAD_PIC, UPLOAD_PIC_REQUEST, UPLOAD_PIC_SUCCESS, UPLOAD_PIC_FAILURE, EMPTY_PIC } from '../../../actions/send/uploadPic';
import { DELETE_PIC, DELETE_PIC_REQUEST, DELETE_PIC_SUCCESS, DELETE_PIC_FAILURE, } from '../../../actions/send/deletePic';
import SEND from '../../../jsons/send.json';

const picture = (state = SEND.description.picture, action) => {
    switch (action.type) {
        case UPLOAD_PIC_SUCCESS:
            return Object.assign({}, state, {
                src: action.payload.src,
            });
        case EMPTY_PIC:
        case DELETE_PIC_SUCCESS:
            return Object.assign({}, state, {
                src: '',
            });
        default:
            return state;
    }
};

export default picture;