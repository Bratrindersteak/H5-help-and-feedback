import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import md5 from 'md5';
import ChatList from './ChatList';
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
    componentDidMount() {
        this.props.connectWebsocket();
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