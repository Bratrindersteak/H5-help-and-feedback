import fetch from 'isomorphic-fetch';
import { WEB_SOCKET_TOKEN, DEV_WEB_SOCKET_TOKEN } from '../../../config';

const FETCH_WS_TOKEN = 'FETCH_WS_TOKEN';
const FETCH_WS_TOKEN_REQUEST = 'FETCH_WS_TOKEN_REQUEST';
const FETCH_WS_TOKEN_SUCCESS = 'FETCH_WS_TOKEN_SUCCESS';
const FETCH_WS_TOKEN_FAILURE = 'FETCH_WS_TOKEN_FAILURE';

const fetchWSTokenRequest= () => {
    return {
        type: FETCH_WS_TOKEN_REQUEST,
        payload: {

        },
    }
};

const fetchWSTokenSuccess = (token) => {
    return {
        type: FETCH_WS_TOKEN_SUCCESS,
        payload: {
            token,
        },
    }
};

const fetchWSTokenFailure = () => {
    return {
        type: FETCH_WS_TOKEN_FAILURE,
        payload: {

        },
    }
};

const fetchWSToken = () => {
    return (dispatch) => {
        dispatch(fetchWSTokenRequest());

        fetch(`${ WEB_SOCKET_TOKEN }getHttpInfo`, {
            method: 'GET',
        }).then((response) =>
            response.json()
        ).then((json) => {
            dispatch(fetchWSTokenSuccess(json.data));
        }).catch((error) => {
            dispatch(fetchWSTokenFailure(error));
        });
    }
};

export {
    FETCH_WS_TOKEN, FETCH_WS_TOKEN_REQUEST, FETCH_WS_TOKEN_SUCCESS, FETCH_WS_TOKEN_FAILURE,
    fetchWSToken, fetchWSTokenRequest, fetchWSTokenSuccess, fetchWSTokenFailure,
};