import { DISPLAY_SEND_BOX } from "../../actions/im/connect";
import { FOLD_SEND_BOX } from '../../actions/send/coverLayer';
import { VIEW_RESIZE } from "../../actions/send/resize";

const display = (state = {
    im: 'block',
    send: 'none',
    height: window.innerHeight,
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
        case VIEW_RESIZE:
            return Object.assign({}, state, {
                height: window.innerHeight,
            });
        default:
            return state;
    }
};

export default display;