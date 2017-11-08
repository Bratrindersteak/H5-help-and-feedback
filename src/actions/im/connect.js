import { WEB_SOCKET_URL, DEV_WEB_SOCKET_URL } from '../../../config';
import { messageUpdate } from './msgUpdate';
import { fetchChatListToken } from './getToken';

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

const connectWebsocketSuccess = () => {
    return {
        type: CONNECT_WEBSOCKET_SUCCESS,
        payload: {

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

const connectWebsocket = () => {

    alert( window.SohuAppPrivates );

    const data = {
        cmd: 1,
        seq: 'token',
        body: {
            version: '4.7.0',
            uid: "pengwu",
            userStatus: 0,
            name: "吴鹏",
            isMember: -1,
            sex: 0,
            username: '顺口溜常客',
            profilePhoto: "http:10.1.2.3",
            account: "hhddasas@dsd",
            passport: "dssddad@ds",
            contactInfo1: "dhsjsd@qq.com",
            contactInfo2: "121234444",
            browser: "Google Chrome",
            browserVersion: "9.0.1",
            appVersion: "3.3.3",
            system: "win7",
            channelId: 342343429443,
            ip: "11.22.22.22",
            isp: 1,
            location: "陕西",
            url: "http:10.2.3.4",
            pn: "ewrrwrrew",
            poid: 1,
            plat: 1,
            source: 1
        }
    };

    return (dispatch, getState) => {
        ws = new WebSocket(DEV_WEB_SOCKET_URL);

        ws.onopen = () => {
            dispatch(connectWebsocketRequest());
            ws.send(JSON.stringify(data));
        };

        ws.onmessage = (message) => {
            const data = JSON.parse(message.data);

            if (data.cmd === 4 && data.body.result === 0) {
                dispatch(connectWebsocketSuccess());
                dispatch(messageUpdate());
                dispatch(fetchChatListToken());
            } else {
                dispatch(connectWebsocketFilture(data.body.reason));
            }
        };

        ws.onclose = () => {
            console.log( 'The connection is closed' );
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