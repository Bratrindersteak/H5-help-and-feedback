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

const sendFeedback = (textarea, img, input) => {

    if (!textarea.value || textarea.style.color) {
        return (dispatch) => {
            dispatch(descriptionValueInvalid());
        }
    }

    if (!input.value || input.style.color) {
        return (dispatch) => {
            dispatch(contactValueInvalid());
        }
    }

    let messageDataText = {
        cmd: 10,
        seq: 'msgImCustomer',
        body: {
            senderUid: '6FBF1C2E-1B6B-45EB-81A2-F70D82FA6EC6',
            receiverUid: '',
            userStatus: 0,
            isRead: 0,
            msgId: 0,
            msgType: 1,
            content: textarea.value,
            contactInfo2: input.value,
        }
    };

    return (dispatch) => {
        dispatch(sendFeedbackRequest ());

        ws.send(JSON.stringify(messageDataText));

        if (img) {
            let messageDataPic = {
                cmd: 10,
                seq: 'msgImCustomer',
                body: {
                    senderUid: '6FBF1C2E-1B6B-45EB-81A2-F70D82FA6EC6',
                    receiverUid: '',
                    userStatus: 0,
                    isRead: 0,
                    msgId: 0,
                    msgType: 2,
                    content: img.src,
                    savable: true,
                }
            };

            dispatch(sendFeedbackRequest ());

            ws.send(JSON.stringify(messageDataPic));
        }
    }
};

export {
    SEND_FEEDBACK, SEND_FEEDBACK_REQUEST, SEND_FEEDBACK_SUCCESS, SEND_FEEDBACK_FAILURE,
    sendFeedback, sendFeedbackRequest, sendFeedbackSuccess, sendFeedbackFailure,
};