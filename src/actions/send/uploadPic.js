import fetch from 'isomorphic-fetch';
import { DOMAIN } from '../../../config';

const UPLOAD_PIC = 'UPLOAD_PIC';
const UPLOAD_PIC_REQUEST = 'UPLOAD_PIC_REQUEST';
const UPLOAD_PIC_SUCCESS = 'UPLOAD_PIC_SUCCESS';
const UPLOAD_PIC_FAILURE = 'UPLOAD_PIC_FAILURE';
const EMPTY_PIC = 'EMPTY_PIC';

const uploadPicRequest = () => {
    return {
        type: UPLOAD_PIC_REQUEST,
        payload: {

        },
    }
};

const uploadPicSuccess = (src, warnColor) => {
    return {
        type: UPLOAD_PIC_SUCCESS,
        payload: {
            src,
            warnColor,
        },
    }
};

const uploadPicFailure = () => {
    return {
        type: UPLOAD_PIC_FAILURE,
        payload: {

        },
    }
};

const uploadPic = (files, isEmptyVal) => {
    return (dispatch) => {
        fetch(`${ DOMAIN }open/auth/token?uid=Client_${ new Date().getTime() }`, {
            method: 'GET',
        }).then((response) =>
            response.json()
        ).then((json) => {
            let body = new FormData();

            body.append('uid', 1);
            body.append('file', files[0]);

            dispatch(uploadPicRequest());

            fetch(`${ DOMAIN }open/sohucloud/upload`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': json.data,
                },
                body: body,
            }).then((response) =>
                response.json()
            ).then((json) => {
                console.log( json );
                dispatch(uploadPicSuccess(json.data, isEmptyVal));
            }).catch((error) => {
                dispatch(uploadPicFailure(error));
            });

        }).catch((error) => {

        })
    }
};

const emptyPic = () => {
    return {
        type: EMPTY_PIC,
        payload: {

        },
    }
};

export {
    UPLOAD_PIC, UPLOAD_PIC_REQUEST, UPLOAD_PIC_SUCCESS, UPLOAD_PIC_FAILURE,
    EMPTY_PIC,
    uploadPic, uploadPicRequest, uploadPicSuccess, uploadPicFailure,
    emptyPic,
};