import React, { Component } from 'react';
import { Text, Picture } from "./ChatItem";

class ChatList extends Component {
    componentDidUpdate() {
        window.scrollTo(0, document.body.clientHeight - window.outerHeight);
    }

    render() {
        const { list, userInfo, fetchChatListToken, picLoading } = this.props;

        return (
            <ul className="message-list iscroll" onTouchEnd={ () => {

                if (window.scrollY === 0) {
                    return fetchChatListToken();
                }
            } }>
                {
                    list.map((item, index) => {

                        if (item.msgType === 1) {
                            return <Text key={ index.toString() } item={ item } userInfo={ userInfo } />
                        }

                        if (item.msgType === 2) {
                            return <Picture key={ index.toString() } item={ item } userInfo={ userInfo } picLoading={ picLoading } />
                        }
                    })
                }
            </ul>
        );
    }
}
export default ChatList;