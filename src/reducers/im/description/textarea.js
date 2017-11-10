import { WRITE_DESCRIPTION } from '../../../actions/send/description';
import SEND from '../../../jsons/send.json';

const textarea = (state = SEND.description.textarea, action) => {
    switch (action.type) {
        case WRITE_DESCRIPTION:
            return Object.assign({}, state, {
                value: action.payload.value,
            });
        default:
            return state;
    }
};

export default textarea;