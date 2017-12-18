import { ws } from '../im/connect';
import { descriptionValueInvalid } from './description';
import { contactValueInvalid } from './contact';

const SEND_FEEDBACK = 'SEND_FEEDBACK';
const SEND_FEEDBACK_REQUEST = 'SEND_FEEDBACK_REQUEST';
const SEND_FEEDBACK_SUCCESS = 'SEND_FEEDBACK_SUCCESS';
const SEND_FEEDBACK_FAILURE = 'SEND_FEEDBACK_FAILURE';

const sendFeedbackRequest = () => {
    return {
        type: SEND_FEEDBACK_REQUEST,
        payload: {

        },
    }
};

const sendFeedbackSuccess = (data) => {
    return {
        type: SEND_FEEDBACK_SUCCESS,
        payload: {
            data,
        },
    }
};

const sendFeedbackFailure = () => {
    return {
        type: SEND_FEEDBACK_FAILURE,
        payload: {

        },
    }
};

const sendFeedback = (senderUid, textarea, img, input) => {

    if ((!textarea.value && !img) || textarea.style.color) {
        return (dispatch) => {
            dispatch(descriptionValueInvalid());
        }
    }

    if (!input.value || input.style.color) {
        return (dispatch) => {
            dispatch(contactValueInvalid());
        }
    }

    if (!/^[1-9][0-9]{5,11}$/.test(input.value) && !/^1[34578]\d{9}$/.test(input.value) && !/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(input.value)) {
        return (dispatch) => {
            dispatch(contactValueInvalid());
        }
    }

    let messageDataText = {
        cmd: 10,
        seq: 'msgImCustomer',
        body: {
            senderUid: senderUid,
            receiverUid: '',
            userStatus: 0,
            isRead: 0,
            msgId: 0,
            msgType: 1,
            content: encodeURI(textarea.value),
            contactInfo2: input.value,
        }
    };

    let messageDataPic = {
        cmd: 10,
        seq: 'msgImCustomer',
        body: {
            senderUid: senderUid,
            receiverUid: '',
            userStatus: 0,
            isRead: 0,
            msgId: 0,
            msgType: 2,
            content: img ? img.src : '',
            savable: true,
        }
    };

    return (dispatch) => {

        if (textarea && textarea.value) {
            dispatch(sendFeedbackRequest());

            ws.send(JSON.stringify(messageDataText));
        }

        if (img && img.src) {
            dispatch(sendFeedbackRequest());

            ws.send(JSON.stringify(messageDataPic));
        }

        localStorage.setItem('imContactValue', input.value);
    }
};

export {
    SEND_FEEDBACK, SEND_FEEDBACK_REQUEST, SEND_FEEDBACK_SUCCESS, SEND_FEEDBACK_FAILURE,
    sendFeedback, sendFeedbackRequest, sendFeedbackSuccess, sendFeedbackFailure,
};