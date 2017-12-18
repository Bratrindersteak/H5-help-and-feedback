import { CONNECT_WEBSOCKET_SUCCESS } from "../../actions/im/connect";

const status = (state = {
    connected: false,
}, action) => {
    switch (action.type) {
        case CONNECT_WEBSOCKET_SUCCESS:
            return Object.assign({}, state, {
                connected: true,
            });
        default:
            return state;
    }
};

export default status;