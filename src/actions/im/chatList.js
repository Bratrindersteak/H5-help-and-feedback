// import fetch from 'isomorphic-fetch';
import { DOMAIN, TEST_DOMAIN, DEV_DOMAIN } from '../../../config';

const FETCH_CHAT_LIST = 'FETCH_CHAT_LIST';
const FETCH_CHAT_LIST_REQUEST = 'FETCH_CHAT_LIST_REQUEST';
const FETCH_CHAT_LIST_SUCCESS = 'FETCH_CHAT_LIST_SUCCESS';
const FETCH_CHAT_LIST_FAILURE = 'FETCH_CHAT_LIST_FAILURE';

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

const fetchChatList = (token, feedbackId = 1, page = 1, size = 10) => {
    return (dispatch) => {
        dispatch(fetchChatListRequest());

        fetch(`${ DEV_DOMAIN }open/message/chatlog/list?feedbackId=${ feedbackId }&page=${ page }&size=${ size }`, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': token
            }
        }).then((response) =>
            response.json()
        ).then((json) => {
            console.log( json );
            dispatch(fetchChatListSuccess(json.data));
        }).catch((error) => {
            dispatch(fetchChatListFailure(error));
        });
    }
};

export {
    FETCH_CHAT_LIST, FETCH_CHAT_LIST_REQUEST, FETCH_CHAT_LIST_SUCCESS, FETCH_CHAT_LIST_FAILURE,
    fetchChatList, fetchChatListRequest, fetchChatListSuccess, fetchChatListFailure,
};