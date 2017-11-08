import fetch from 'isomorphic-fetch';
import { DOMAIN, TEST_DOMAIN, DEV_DOMAIN } from '../../../config';
import { ws } from '../im/connect';

const WRITE_DESCRIPTION = 'WRITE_DESCRIPTION';
const UPLOAD_PIC = 'UPLOAD_PIC';
const WRITE_CONTACT = 'WRITE_CONTACT';
const SEND_FEEDBACK = 'SEND_FEEDBACK';
const SEND_FEEDBACK_REQUEST = 'SEND_FEEDBACK_REQUEST';
const SEND_FEEDBACK_SUCCESS = 'SEND_FEEDBACK_SUCCESS';
const SEND_FEEDBACK_FAILURE = 'SEND_FEEDBACK_FAILURE';

const writeDescription = (textarea) => {
    return {
        type: WRITE_DESCRIPTION,
        payload: {
            value: textarea.value,
            count: textarea.value.length,
        },
    }
};

const uploadPic = (files) => {

    console.log(files);
    console.log(files[0]);

    return (dispatch) => {
        fetch(`${ TEST_DOMAIN }open/auth/token?uid=Client_${ new Date().getTime() }`, {
            method: 'GET',
        }).then((response) =>
            response.json()
        ).then((json) => {
            let body = new FormData();

            body.append('uid', 1);
            body.append('file', files[0]);

            fetch(`${ TEST_DOMAIN }open/sohucloud/upload`, {
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
            }).catch((error) => {
                console.log( error )
            })
        }).catch((error) => {
            dispatch(fetchChatListTokenFailure(error));
        })
    }
};

const writeContact = (input) => {
    return {
        type: WRITE_CONTACT,
        payload: {
            value: input.value,
        },
    }
};

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

const sendFeedback = (textarea, input) => {
    const data = {
        cmd:10,
        seq:"msgImCustomer",
        body: {
            senderUid: 'pengwu',
            receiverUid: '',
            userStatus: 0,   //0客户 1客服
            isRead: 0,   //0未读 1.已读
            msgId: 0,
            msgType: 1,  //1文字 2 图片
            content: textarea.value,
            // createTime: 1222222222222223
        }
    };

    return (dispatch) => {
        dispatch(sendFeedbackRequest ());

        ws.send(JSON.stringify(data));

        ws.onmessage = (message) => {
            const data = JSON.parse(message.data);

            if (data.cmd === 10 && data.cmd === 5) {
                dispatch(sendFeedbackSuccess(data));
            } else {
                dispatch(sendFeedbackFailure());
            }
        };
    }
};

export {
    WRITE_DESCRIPTION, UPLOAD_PIC, WRITE_CONTACT,
    SEND_FEEDBACK, SEND_FEEDBACK_REQUEST, SEND_FEEDBACK_SUCCESS, SEND_FEEDBACK_FAILURE,
    writeDescription, uploadPic, writeContact,
    sendFeedback, sendFeedbackRequest, sendFeedbackSuccess, sendFeedbackFailure,
};