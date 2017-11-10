import { ws } from './connect';

const MESSAGE_UPDATE = 'MESSAGE_UPDATE';
const MESSAGE_UPDATE_REQUEST = 'MESSAGE_UPDATE_REQUEST';
const MESSAGE_UPDATE_SUCCESS = 'MESSAGE_UPDATE_SUCCESS';
const MESSAGE_UPDATE_FAILURE = 'MESSAGE_UPDATE_FAILURE';

const messageUpdateRequest = () => {
    return {
        type: MESSAGE_UPDATE_REQUEST,
        payload: {

        }
    }
};

const messageUpdateSuccess = () => {
    return {
        type: MESSAGE_UPDATE_SUCCESS,
        payload: {

        }
    }
};

const messageUpdateFilture = () => {
    return {
        type: MESSAGE_UPDATE_FAILURE,
        payload: {

        }
    }
};

const messageUpdate = (feedbackId, uid) => {
    const data = {
        cmd: 9,
        seq: 'MSG_IM_STATUS',
        body: {
            feedbackId: feedbackId,
            uid: uid,
        },
    };

    return (dispatch, getState) => {
        ws.send(JSON.stringify(data));

        dispatch(messageUpdateRequest());

        ws.onmessage = (message) => {
            const data = JSON.parse(message.data);

            if (data.cmd === 15) {
                dispatch(messageUpdateSuccess());
            }
            if (data.cmd === 16) {
                dispatch(messageUpdateFilture(data.body.reason));
            }
        };
    }
};

export {
    MESSAGE_UPDATE, MESSAGE_UPDATE_REQUEST, MESSAGE_UPDATE_SUCCESS, MESSAGE_UPDATE_FAILURE,
    messageUpdate, messageUpdateRequest, messageUpdateSuccess, messageUpdateFilture,
};