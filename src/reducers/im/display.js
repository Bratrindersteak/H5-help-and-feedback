import { DISPLAY_SEND_BOX } from "../../actions/im/connect";

const display = (state = {
    im: 'block',
    send: 'none',
}, action) => {
    switch (action.type) {
        case DISPLAY_SEND_BOX:
            return Object.assign({}, state, {
                im: 'none',
                send: 'block',
            });
        default:
            return state;
    }
};

export default display;