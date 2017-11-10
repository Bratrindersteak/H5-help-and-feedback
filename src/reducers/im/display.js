import { DISPLAY_SEND_BOX } from "../../actions/im/connect";
import { HIDE_COVER_LAYER } from '../../actions/send/coverLayer';

const display = (state = {
    im: 'block',
    send: 'none',
}, action) => {
    switch (action.type) {
        case DISPLAY_SEND_BOX:
            return Object.assign({}, state, {
                send: 'block',
            });
        case HIDE_COVER_LAYER:
            return Object.assign({}, state, {
                send: 'none',
            });
        default:
            return state;
    }
};

export default display;