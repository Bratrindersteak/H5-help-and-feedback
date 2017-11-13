import { FETCH_CHAT_LIST, FETCH_CHAT_LIST_REQUEST, FETCH_CHAT_LIST_SUCCESS, FETCH_CHAT_LIST_FAILURE } from "../../actions/im/chatList";

const list = (state = [], action) => {
    switch (action.type) {
        case FETCH_CHAT_LIST_SUCCESS:
            return [
                ...action.payload.data,
                ...state,
            ];
        default:
            return state;
    }
};

export default list;