import React, { Component } from 'react';
import { Log, Text, Picture, Default } from "./ChatItem";

class ChatList extends Component {
    componentDidUpdate() {
        window.scrollTo(0, document.body.clientHeight - window.outerHeight);
    }

    render() {
        const { list, userInfo, week, fetchChatListToken, picLoading } = this.props;

        return (
            <ul className="message-list" onTouchEnd={ (event) => {

                console.log( event.nativeEvent );
                console.log( event.timeStamp );

                if (window.scrollY === 0) {
                    console.log( 'here' );
                     // fetchChatListToken();
                }
            } } onTouchMove={ (event) => {

                if (window.scrollY === 0) {
                    alert( event.currentTarget );
                }
            } }>
                {
                    list.map((item, index) => {

                        if (item.msgType === 100) {
                            return <Default key={ index.toString() } item={ item } userInfo={ userInfo } week={ week } />;
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