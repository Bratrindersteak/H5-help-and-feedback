let DOMAIN = '//feedback.tv.sohu.com/';
let WEB_SOCKET_URL = 'ws://feedback.tv.sohu.com/im/ws';
let WEB_SOCKET_TOKEN = '//feedback.tv.sohu.com/im-api/';
let FB_API_DOMAIN = '//api.tv.sohu.com/';

// 测试环境.
if (window.location.origin.includes('//t.m.tv.sohu.com')) {
    DOMAIN = '//fbtest.tv.sohu.com/';
    // WEB_SOCKET_URL = 'ws://fbtest.tv.sohu.com/im/ws';
    // WEB_SOCKET_URL = 'ws://10.2.129.226:6872/ws';
    WEB_SOCKET_URL = 'ws://fbtest.tv.sohu.com/im/ws';
    // WEB_SOCKET_TOKEN = '//10.2.129.226:6873/';
    WEB_SOCKET_TOKEN = '//fbtest.tv.sohu.com/im-api/';
    FB_API_DOMAIN = '//testapi.hd.sohu.com/';
}

// 本地环境.
if (window.location.origin.includes('//max.sohu.com')) {
    DOMAIN = '//fbtest.tv.sohu.com/';
    // DOMAIN = '//dev.feedback.sohuno.com:8080/';
    WEB_SOCKET_URL = 'ws://fbtest.tv.sohu.com/im/ws';
    // WEB_SOCKET_URL = 'ws://10.2.131.27:6872/ws';
    WEB_SOCKET_TOKEN = '//fbtest.tv.sohu.com/im-api/';
    // WEB_SOCKET_TOKEN = '//10.2.131.27:6873/';
    FB_API_DOMAIN = '//testapi.hd.sohu.com/';
}

export {
    DOMAIN, WEB_SOCKET_URL, WEB_SOCKET_TOKEN, FB_API_DOMAIN,
};