import React, { Component } from 'react';
import { Text, Picture, Default } from "./ChatItem";

class ChatList extends Component {
    componentDidUpdate() {
        window.scrollTo(0, document.body.clientHeight - window.outerHeight);
    }

    render() {
        const { list, userInfo, week, fetchChatListToken, picLoading } = this.props;

        return (
            <ul className="message-list" onTouchEnd={ () => {

                if (window.scrollY === 0) {
                     fetchChatListToken();
                }
            } }>
                {
                    list.map((item, index) => {

                        if (item.msgType === 0) {
                            return <Default key={ index.toString() } item={ item } userInfo={ userInfo } week={ week } />;
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