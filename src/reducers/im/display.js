import { DISPLAY_SEND_BOX } from "../../actions/im/connect";
import { FOLD_SEND_BOX } from '../../actions/send/coverLayer';

const display = (state = {
    im: 'block',
    send: 'none',
}, action) => {
    switch (action.type) {
        case DISPLAY_SEND_BOX:
            return Object.assign({}, state, {
                send: 'block',
            });
        case FOLD_SEND_BOX:
            return Object.assign({}, state, {
                send: 'none',
            });
        default:
            return state;
    }
};

export default display;