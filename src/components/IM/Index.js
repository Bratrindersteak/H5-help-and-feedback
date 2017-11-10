import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import md5 from 'md5';
import ChatList from '../../containers/IM/ChatList';
import Send from '../../containers/IM/Send';

console.log( md5( `xqqqqqqqqqqqqqq${new Date().getTime()}!1@2#3$4` ) );

if (window.SohuAppPrivates) {
    alert(window.SohuAppPrivates);
}

const data = {
    cmd: 1,
    seq: 'token',
    body: {
        version: '4.7.0',
        uid: "xqqqqqqqqqqqqqq",
        userStatus: 0,
        name: "李小",
        isMember: 0,
        sex: 0,
        username: '萌小妹',
        profilePhoto: "http:10.1.2.3",
        account: "hhddasas@dsd",
        passport: "dssddad@ds",
        contactInfo1: "dhsjsd@qq.com",
        contactInfo2: "121234444",
        browser: "火狐",
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

const sendMsg = {
    cmd:10,
    seq:"msgImCustomer",
    body: {
        senderUid:"xqqqqqqqqqqqqqq",
        receiverUid:"gffhfghgfffff",
        userStatus:0,   //0客户 1客服
        isRead:1,   //0未读 1.已读
        msgId:1233455666667,
        msgType:1,  //1文字 2 图片
        content:"dsdkkdfkdgk",
        createTime:1222222222222223
    }
};

const msgRead = {
    cmd: 9,
    seq: "MSG_IM_STATUS",
    body: {
        msgId: 0,
        feedbackId: 0,
        uid: "xqqqqqqqqqqqqqq"
    }
};

const userList = {
    cmd: 11,
    seq:"customer_join"
};

class IM extends Component {
    componentWillMount() {
        let count = 0;
        let userInfo;
        let timer = setInterval(() => {

            if (window.SohuAppPrivates) {
                userInfo = JSON.parse(window.SohuAppPrivates);

                this.props.connectWebsocket(userInfo);
                clearInterval(timer);

                return;
            }

            if (count === 60) {
                userInfo = {
                    passport: 'ppag201793c375ff@sohu.com',
                    token: 'eyJleHAiOjE1MTM3NTQ4NDEyNzcsImlhdCI6MTUwNTk3ODg0MTI3NywicHAiOiJwcGFnMjAxNzkzYzM3NWZmQHNvaHUuY29tIiwidGsiOiJ6ME44VVZQczl0M0J0OFFuTm5ZNENOZmhLckN1ZUtCMSIsInYiOjB9.Kxg7PjBef9x21lKINm_6s5IYXHg1IM41_B4sSgGXnYA',
                    uid: '6FBF1C2E-1B6B-45EB-81A2-F70D82FA6EC6',
                    gid: 'x010740101010ca114dff5855000ceb4252e76abd6f7',
                    plat: 3,
                    sver: '6.8.6',
                    app_id: 1,
                    appid: 107401,
                    appvs: '6.8',
                    ua: 'AppleCoreMedia/1.0.0.12B440 (iPhone, U, CPU OS 8_1_2 like Mac OS X, zh_cn)',
                    passport_id: '210668446',
                    mobile: '15810001666',
                    nickname: 'Baymax小白',
                    poid: 1,
                    webtype: 'wifi',
                    userImg: 'http://css.tv.itc.cn/channel/space/avatar/05_small.jpg',
                    sysver: '10.3.2',
                    partner: 6932,
                    systime: 1505983869.795317,
                    wxinstall: 1,
                };

                this.props.connectWebsocket(userInfo);
                clearInterval(timer);

                return;
            }

            count += 1;
        }, 50);
    }

    render() {
        const { display } = this.props;

        return (
            <div className="im" style={{ display: display }}>
                <ChatList />
                <Send />
                <div className="loading-icon transparent" id="loading"></div>
                <div className="display-layer" id="displayLayer" style={{ display: 'none' }}><img className="wide reset" src="" /></div>
            </div>
        );
    }
}

export default IM;