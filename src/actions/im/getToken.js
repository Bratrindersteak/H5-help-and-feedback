import fetch from 'isomorphic-fetch';
import { DOMAIN, TEST_DOMAIN, DEV_DOMAIN } from '../../../config';
import { fetchChatList } from './chatList';

const FETCH_CHAT_LIST_TOKEN = 'FETCH_CHAT_LIST_TOKEN';
const FETCH_CHAT_LIST_TOKEN_REQUEST = 'FETCH_CHAT_LIST_TOKEN_REQUEST';
const FETCH_CHAT_LIST_TOKEN_SUCCESS = 'FETCH_CHAT_LIST_TOKEN_SUCCESS';
const FETCH_CHAT_LIST_TOKEN_FAILURE = 'FETCH_CHAT_LIST_TOKEN_FAILURE';

const fetchChatListTokenRequest = () => {
    return {
        type: FETCH_CHAT_LIST_TOKEN_REQUEST,
        payload: {},
    }
};

const fetchChatListTokenSuccess = (token) => {
    return {
        type: FETCH_CHAT_LIST_TOKEN_SUCCESS,
        payload: {
            token,
        },
    }
};

const fetchChatListTokenFailure = (error) => {
    return {
        type: FETCH_CHAT_LIST_TOKEN_FAILURE,
        payload: {
            error,
        },
    }
};

const fetchChatListToken = () => {
    return (dispatch) => {
        dispatch(fetchChatListTokenRequest());

        fetch(`${ DEV_DOMAIN }open/auth/token?uid=Client_${ new Date().getTime() }`, {
            method: 'GET',
        }).then((response) =>
            response.json()
        ).then((json) => {
            console.log( json );
            dispatch(fetchChatListTokenSuccess(json.data));
            dispatch(fetchChatList(json.data, 1, 1, 10));
        }).catch((error) => {
            dispatch(fetchChatListTokenFailure(error));
        });
    }
};

export {
    FETCH_CHAT_LIST_TOKEN, FETCH_CHAT_LIST_TOKEN_REQUEST, FETCH_CHAT_LIST_TOKEN_SUCCESS, FETCH_CHAT_LIST_TOKEN_FAILURE,
    fetchChatListToken, fetchChatListTokenRequest, fetchChatListTokenSuccess, fetchChatListTokenFailure,
};