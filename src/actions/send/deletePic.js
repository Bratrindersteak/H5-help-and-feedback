import fetch from 'isomorphic-fetch';
import { DOMAIN } from '../../../config';

const DELETE_PIC = 'DELETE_PIC';
const DELETE_PIC_REQUEST = 'DELETE_PIC_REQUEST';
const DELETE_PIC_SUCCESS = 'DELETE_PIC_SUCCESS';
const DELETE_PIC_FAILURE = 'DELETE_PIC_FAILURE';

const deletePicRequest = () => {
    return {
        type: DELETE_PIC_REQUEST,
        payload: {

        },
    }
};

const deletePicSuccess = (src) => {
    return {
        type: DELETE_PIC_SUCCESS,
        payload: {
            src,
        },
    }
};

const deletePicFailure = () => {
    return {
        type: DELETE_PIC_FAILURE,
        payload: {

        },
    }
};

const deletePic = (src) => {
    return (dispatch) => {
        fetch(`${ DOMAIN }open/auth/token?uid=Client_${ new Date().getTime() }`, {
            method: 'GET',
        }).then((response) =>
            response.json()
        ).then((json) => {
            let body = new FormData();

            body.append('key[]', src.split('feedback.bjcnc.scs.sohucs.com/')[1]);

            dispatch(deletePicRequest());

            fetch(`${ TEST_DOMAIN }open/sohucloud/delete`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': json.data,
                },
                body: body,
            }).then((response) =>
                response.json()
            ).then((json) => {

                if (json.status === 200) {
                    dispatch(deletePicSuccess());
                }
            }).catch((error) => {
                dispatch(deletePicFailure(error));
            });
        }).catch((error) => {

        })
    }
};

export {
    DELETE_PIC, DELETE_PIC_REQUEST, DELETE_PIC_SUCCESS, DELETE_PIC_FAILURE,
    deletePic, deletePicRequest, deletePicSuccess, deletePicFailure,
};