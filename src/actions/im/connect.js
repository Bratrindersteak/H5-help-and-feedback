import { WEB_SOCKET_URL } from '../../../config';
import { fetchChatListToken } from './getToken';
import { addChatItem } from './chatItem';
import { rewritingDescription } from '../send/description';
import { foldSendBox } from "../send/coverLayer";
import { sendFeedbackSuccess } from "../send/send";
import { emptyPic } from "../send/uploadPic";

const CONNECT_WEBSOCKET = 'CONNECT_WEBSOCKET';
const CONNECT_WEBSOCKET_REQUEST = 'CONNECT_WEBSOCKET_REQUEST';
const CONNECT_WEBSOCKET_SUCCESS = 'CONNECT_WEBSOCKET_SUCCESS';
const CONNECT_WEBSOCKET_FAILURE = 'CONNECT_WEBSOCKET_FAILURE';
const DISPLAY_SEND_BOX = 'DISPLAY_SEND_BOX';
let ws;

const connectWebsocketRequest = () => {
    return {
        type: CONNECT_WEBSOCKET_REQUEST,
        payload: {

        }
    }
};

const connectWebsocketSuccess = (feedbackId) => {
    return {
        type: CONNECT_WEBSOCKET_SUCCESS,
        payload: {
            feedbackId,
        }
    }
};

const connectWebsocketFilture = () => {
    return {
        type: CONNECT_WEBSOCKET_FAILURE,
        payload: {

        }
    }
};

const connectWebsocket = (userInfo) => {
    const data = {
        cmd: 1,
        seq: 'token',
        body: {
            version: '4.7.0',
            uid: userInfo.uid,
            userStatus: 0,
            gender: -1,
            username: userInfo.nickname,
            profilePhoto: userInfo.userImg,
            passport: userInfo.passport,
            contactInfo1: '',
            contactInfo2: '',
            appVersion: userInfo.sver,
            system: userInfo.sysver,
            channelId: userInfo.partner,
            pn: userInfo.ua,
            poid: userInfo.poid,
            plat: userInfo.plat,
            gid: userInfo.gid,
            appid: userInfo.appid,
            ua: userInfo.ua,
            token: userInfo.token,
        }
    };

    return (dispatch, getState) => {
        ws = new WebSocket(WEB_SOCKET_URL);

        ws.onopen = () => {
            dispatch(connectWebsocketRequest());
            ws.send(JSON.stringify(data));
        };

        ws.onmessage = (message) => {
            const data = JSON.parse(message.data);

            if (data.cmd === 4) {

                if (data.body.result === 0) {
                    dispatch(connectWebsocketSuccess(data.body.feedbackId));
                    dispatch(fetchChatListToken(data.body.feedbackId, 0, 10));
                } else {
                    dispatch(connectWebsocketFilture(data.body.reason));
                }

                let IMHeart = setInterval(() => {
                    ws.send(JSON.stringify({
                        cmd: 2,
                        seq: "heart",
                        body: {},
                    }))
                }, 20000);
            }

            if (data.cmd === 5) {
                dispatch(sendFeedbackSuccess(data));
                dispatch(addChatItem(data.body));
                dispatch(rewritingDescription());
                dispatch(emptyPic());
                dispatch(foldSendBox());
            }

            if (data.cmd === 10) {

                if (data.body.msgSystem) {
                    setTimeout(() => dispatch(addChatItem(data.body)), 200);
                } else {
                    dispatch(addChatItem(data.body));
                }
            }
        };

        ws.onclose = () => {
            window.location.reload();
        };
    }
};

const displaySendBox = () => {
    return {
        type: DISPLAY_SEND_BOX,
        payload: {

        },
    }
};

export {
    CONNECT_WEBSOCKET, CONNECT_WEBSOCKET_REQUEST, CONNECT_WEBSOCKET_SUCCESS, CONNECT_WEBSOCKET_FAILURE,
    DISPLAY_SEND_BOX,
    connectWebsocket, connectWebsocketRequest, connectWebsocketSuccess, connectWebsocketFilture,
    displaySendBox,
    ws,
};