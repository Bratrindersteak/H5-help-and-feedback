import md5 from 'md5';
import USER_INFO from '../../jsons/userInfo.json';
import { GET_USER_INFO } from "../../actions/im/userInfo";
import { FETCH_WS_TOKEN, FETCH_WS_TOKEN_REQUEST, FETCH_WS_TOKEN_SUCCESS, FETCH_WS_TOKEN_FAILURE } from '../../actions/im/wsToken';

const userInfo = (state = USER_INFO, action) => {
    switch (action.type) {
        case GET_USER_INFO:
            return Object.assign({}, state, action.payload.userInfo, {
                token: '',
            });
        case FETCH_WS_TOKEN_SUCCESS:
            return Object.assign({}, state, {
                token: md5( `${ state.uid }${ action.payload.token }` ),
            });
        default:
            return state;
    }
};

export default userInfo;