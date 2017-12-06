let DOMAIN = '//feedback.sohu.com/';
let WEB_SOCKET_URL = 'ws://10.17.21.159:6872/ws';
let WEB_SOCKET_TOKEN = '//10.17.21.159:6873/';

// 测试环境.
if (window.location.origin.includes('//t.m.tv.sohu.com')) {
    DOMAIN = '//test.feedback.sohuno.com/';
    WEB_SOCKET_URL = 'ws://10.17.21.159:6872/ws';
    WEB_SOCKET_TOKEN = '//10.17.21.159:6873/';
}

// 本地环境.
if (window.location.origin.includes('//max.sohu.com')) {
    DOMAIN = '//test.feedback.sohuno.com/';
    // DOMAIN = '//dev.feedback.sohuno.com:8080/';
    // WEB_SOCKET_URL = 'ws://10.17.21.159:6872/ws';
    WEB_SOCKET_URL = 'ws://10.2.131.27:6872/ws';
    WEB_SOCKET_TOKEN = '//10.17.21.159:6873/';
    // WEB_SOCKET_TOKEN = '//10.2.131.27:6873/';
}

export {
    DOMAIN, WEB_SOCKET_URL, WEB_SOCKET_TOKEN,
};