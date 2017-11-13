import React, { Component } from 'react';
import { Text, Picture } from "./ChatItem";

class ChatList extends Component {
    componentDidUpdate() {
        window.scrollTo(0, document.body.clientHeight - window.outerHeight);
    }

    render() {
        const { list, userInfo, week, fetchChatListToken, picLoading } = this.props;

        console.log( list.length );

        return (
            <ul className="message-list" onTouchEnd={ () => {

                if (window.scrollY === 0) {
                     fetchChatListToken();
                }
            } }>
                {
                    list.length ? list.map((item, index) => {

                        if (item.msgType === 1) {
                            return <Text key={ index.toString() } item={ item } userInfo={ userInfo } week={ week } />
                        }

                        if (item.msgType === 2) {
                            return <Picture key={ index.toString() } item={ item } userInfo={ userInfo } week={ week } picLoading={ picLoading } />
                        }
                    }) :
                    <li className="message-box">
                        <div className="time-info">星期五 17:53</div>
                        <div className="main-info text clear">
                            <div className="portrait"><img src="//feedback.bjcnc.scs.sohucs.com/1_default_user_1510213182513.png" width="100%" /></div>
                            <div className="content">
                                <p className="info">来啦～～随便坐啊</p>
                                <p className="info">下面的热点问题是小狐精心准备的，看看能解决您的问题不？</p>
                                <a href="#" className="nav-link">播放问题</a>
                                <a href="#" className="nav-link">会员问题</a>
                                <a href="#" className="nav-link">缓存问题</a>
                                <a href="#" className="nav-link">查看其他热点问题</a>
                                <p className="info">如果仍然无法解决，可以直接输入你的问题，小狐狸帮您看看！</p>
                            </div>
                        </div>
                    </li>
                }
            </ul>
        );
    }
}
export default ChatList;