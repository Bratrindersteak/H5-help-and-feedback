import { WRITE_DESCRIPTION } from '../../../actions/send/description';
import SEND from '../../../jsons/send.json';

const count = (state = SEND.description.count, action) => {
    switch (action.type) {
        case WRITE_DESCRIPTION:
            return Object.assign({}, state, {
                current: action.payload.count,
            });
        default:
            return state;
    }
};

export default count;