import { FETCH_CHAT_LIST, FETCH_CHAT_LIST_REQUEST, FETCH_CHAT_LIST_SUCCESS, FETCH_CHAT_LIST_FAILURE } from "../../actions/im/chatList";

const list = (state = [], action) => {
    switch (action.type) {
        case FETCH_CHAT_LIST_SUCCESS:
            let list = action.payload.data.map((item) => {

                if (item.userStatus === 0 && item.profilePhoto === null) {
                    return Object.assign({}, item, {
                        profilePhoto: '//feedback.bjcnc.scs.sohucs.com/1_default_user_1510213182513.png',
                    });
                }

                return item;
            });

            return [
                ...list,
                ...state,
            ];
        default:
            return state;
    }
};

export default list;