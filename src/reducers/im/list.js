import { FETCH_CHAT_LIST, FETCH_CHAT_LIST_REQUEST, FETCH_CHAT_LIST_SUCCESS, FETCH_CHAT_LIST_FAILURE } from "../../actions/im/chatList";
import { ADD_CHAT_ITEM } from "../../actions/im/chatItem";

const list = (state = [], action) => {
    switch (action.type) {
        case FETCH_CHAT_LIST_SUCCESS:

            if (state.length === 0 && action.payload.data.length === 0) {
                return [{
                    msgType: 100,
                    userStatus: 1,
                }];
            }

            if (action.payload.data.length > 0) {

                if (state.length === 1 && state[0].msgType === 0) {
                    return [
                        ...action.payload.data,
                    ];
                }

                return [
                    ...action.payload.data,
                    ...state,
                ];
            }

            return state;
        case FETCH_CHAT_LIST_FAILURE:
            return [{
                msgType: 100,
                userStatus: 1,
            }];
        case ADD_CHAT_ITEM:
            return [
                ...state,
                action.payload.message,
            ];
        default:
            return state;
    }
};

export default list;