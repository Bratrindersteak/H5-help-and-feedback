import React, { Component } from 'react';
import { Log, Text, Picture, Default } from "./ChatItem";

class ChatList extends Component {
    componentDidMount() {
        const { userInfo, fetchNav } = this.props;

        fetchNav(userInfo.plat, userInfo.sver);
    }

    componentDidUpdate() {
        window.scrollTo(0, document.body.clientHeight - window.outerHeight);
    }

    render() {
        const { list, userInfo, week, nav, fetchChatListToken, picLoading } = this.props;

        return (
            <ul className="message-list" onTouchEnd={(event) => {

                if (window.scrollY <= 0 && list.length) {
                    fetchChatListToken(userInfo.feedbackId, list.length, 10);
                }
            }}>
                {
                    list.map((item, index) => {

                        if (item.msgType === 100) {
                            return <Default key={ index.toString() } item={ item } userInfo={ userInfo } week={ week } nav={ nav } />;
                        }

                        if (item.msgType === 0) {
                            return <Log key={ index.toString() } item={ item } userInfo={ userInfo } week={ week } />
                        }

                        if (item.msgType === 1) {
                            return <Text key={ index.toString() } item={ item } userInfo={ userInfo } week={ week } />
                        }

                        if (item.msgType === 2) {
                            return <Picture key={ index.toString() } item={ item } userInfo={ userInfo } week={ week } picLoading={ picLoading } />
                        }
                    })
                }
            </ul>
        );
    }
}
export default ChatList;