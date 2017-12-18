import md5 from 'md5';
import USER_INFO from '../../jsons/userInfo.json';
import { GET_USER_INFO } from "../../actions/im/userInfo";
import { CONNECT_WEBSOCKET_SUCCESS } from "../../actions/im/connect";
import { FETCH_WS_TOKEN, FETCH_WS_TOKEN_REQUEST, FETCH_WS_TOKEN_SUCCESS, FETCH_WS_TOKEN_FAILURE } from '../../actions/im/wsToken';

const userInfo = (state = USER_INFO, action) => {
    switch (action.type) {
        case GET_USER_INFO:
            return Object.assign({}, state, action.payload.userInfo, {
                plat: parseInt(action.payload.userInfo.plat, 10),
                poid: parseInt(action.payload.userInfo.poid, 10),
                partner: parseInt(action.payload.userInfo.partner, 10),
                token: '',
                userImg: action.payload.userInfo.userImg || '//feedback.bjcnc.scs.sohucs.com/1_default_user_1510213182513.png',
            });
        case CONNECT_WEBSOCKET_SUCCESS:
            return Object.assign({}, state, {
                feedbackId: action.payload.feedbackId,
            });
        case FETCH_WS_TOKEN_SUCCESS:

            if (!state.token) {
                return Object.assign({}, state, {
                    token: md5( `${ state.uid }${ action.payload.token }` ),

                });
            }

            return state;
        default:
            return state;
    }
};

export default userInfo;