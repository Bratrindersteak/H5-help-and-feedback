import fetch from 'isomorphic-fetch';
import { FB_API_DOMAIN } from '../../../config';

const FETCH_NAV = 'FETCH_NAV';
const FETCH_NAV_REQUEST = 'FETCH_NAV_REQUEST';
const FETCH_NAV_SUCCESS = 'FETCH_NAV_SUCCESS';
const FETCH_NAV_FAILURE = 'FETCH_NAV_FAILURE';

const fetchNavRequest = () => {
    return {
        type: FETCH_NAV_REQUEST,
        payload: {},
    }
};

const fetchNavSuccess = (data) => {
    return {
        type: FETCH_NAV_SUCCESS,
        payload: {
            data,
        },
    }
};

const fetchNavFailure = (error) => {
    return {
        type: FETCH_NAV_FAILURE,
        payload: new Error(error),
        error: true,
    }
};

const fetchNav = (plat, sver) => {
    return (dispatch) => {
        dispatch(fetchNavRequest());

        $.ajax({
            type: 'GET',
            url: `${ FB_API_DOMAIN }v6/mobile/h5/helpList.json`,
            data: {
                api_key: '9854b2afa779e1a6bff1962447a09dbd',
                page_index: 0,
                plat: plat,
                sver: sver,
            },
            dataType:'jsonp',
            jsonp:'callback',
            success: function(data){
                dispatch(fetchNavSuccess(data.data.columns));
            },
            error: function(error){
                dispatch(fetchNavFailure(error));
            },
        });
    }
};

export {
    FETCH_NAV, FETCH_NAV_REQUEST, FETCH_NAV_SUCCESS, FETCH_NAV_FAILURE,
    fetchNav, fetchNavRequest, fetchNavSuccess, fetchNavFailure,
};