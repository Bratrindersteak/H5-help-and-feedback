import fetch from 'isomorphic-fetch';
import { DOMAIN } from '../../../config';

const FETCH_CHAT_LIST = 'FETCH_CHAT_LIST';
const FETCH_CHAT_LIST_REQUEST = 'FETCH_CHAT_LIST_REQUEST';
const FETCH_CHAT_LIST_SUCCESS = 'FETCH_CHAT_LIST_SUCCESS';
const FETCH_CHAT_LIST_FAILURE = 'FETCH_CHAT_LIST_FAILURE';

let listPage = 1;

const fetchChatListRequest = () => {
    return {
        type: FETCH_CHAT_LIST_REQUEST,
        payload: {},
    }
};

const fetchChatListSuccess = (data) => {
    return {
        type: FETCH_CHAT_LIST_SUCCESS,
        payload: {
            data,
        },
    }
};

const fetchChatListFailure = (error) => {
    return {
        type: FETCH_CHAT_LIST_FAILURE,
        payload: {
            error,
        },
    }
};

const fetchChatList = (token, feedbackId, page = listPage, size = 10) => {

    if (!feedbackId) {
        return (dispatch) => {
            dispatch(fetchChatListFailure());
        }
    }

    return (dispatch) => {
        dispatch(fetchChatListRequest());

        fetch(`${ DOMAIN }open/message/chatlog/list?feedbackId=${ feedbackId }&page=${ page }&size=${ size }`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': token
            }
        }).then((response) =>
            response.json()
        ).then((json) => {
            console.log( json );
            dispatch(fetchChatListSuccess(json.data));

            listPage += 1;
        }).catch((error) => {
            dispatch(fetchChatListFailure(error));
        });
    }
};

export {
    FETCH_CHAT_LIST, FETCH_CHAT_LIST_REQUEST, FETCH_CHAT_LIST_SUCCESS, FETCH_CHAT_LIST_FAILURE,
    fetchChatList, fetchChatListRequest, fetchChatListSuccess, fetchChatListFailure,
};