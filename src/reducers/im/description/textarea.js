import SEND from '../../../jsons/send.json';
import { WRITING_DESCRIPTION, DESCRIPTION_VALUE_INVALID, REWRITING_DESCRIPTION } from '../../../actions/send/description';

const textarea = (state = SEND.description.textarea, action) => {
    switch (action.type) {
        case WRITING_DESCRIPTION:
            return Object.assign({}, state, {
                value: action.payload.value,
            });
        case DESCRIPTION_VALUE_INVALID:
            return Object.assign({}, state, {
                value: '请填写问题描述',
                color: '#ff382e',
            });
        case REWRITING_DESCRIPTION:
            return Object.assign({}, state, {
                value: '',
                color: '',
            });
        default:
            return state;
    }
};

export default textarea;