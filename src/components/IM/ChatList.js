import React, { Component } from 'react';

class ChatList extends Component {
    componentDidUpdate() {
        window.scrollTo(0, document.body.clientHeight - window.outerHeight);
    }

    render() {
        const { list, fetchChatListToken } = this.props;

        return (
            <ul className="message-list iscroll" onTouchEnd={ () => {

                if (window.scrollY === 0) {
                    return fetchChatListToken();
                }
            } }>
                {
                    list.map((item, index) => {

                        if (item.msgType === 1) {
                            return (
                                <li className="message-box" key={ index.toString() }>
                                    <div className="time-info">
                                        {
                                            `${
                                                new Date(item.createTime).getFullYear()
                                                }-${
                                                new Date(item.createTime).getMonth() + 1 >= 10 ? new Date(item.createTime).getMonth() + 1 : '0' + ( new Date(item.createTime).getMonth() + 1 )
                                                }-${
                                                new Date(item.createTime).getDate() >= 10 ? new Date(item.createTime).getDate() : '0' + ( new Date(item.createTime).getDate() )
                                                } ${
                                                new Date(item.createTime).getHours() >= 10 ? new Date(item.createTime).getHours() : '0' + ( new Date(item.createTime).getHours() )
                                                }:${
                                                new Date(item.createTime).getMinutes() >= 10 ? new Date(item.createTime).getMinutes() : '0' + ( new Date(item.createTime).getMinutes() )
                                                }`
                                        }
                                    </div>
                                    <div className={`main-info ${ item.userStatus ? '' : 'mein' } text clear`}>
                                        <div className="portrait">
                                            <img src={ item.profilePhoto } width="100%" />
                                        </div>
                                        <div className="content">
                                            <p className="info">{ item.content }</p>
                                        </div>
                                    </div>
                                </li>
                            )
                        }

                        if (item.msgType === 2) {
                            return (
                                <li className="message-box" key={ index.toString() }>
                                    <div className="time-info">
                                        {
                                            `${
                                                new Date(item.createTime).getFullYear()
                                                }-${
                                                new Date(item.createTime).getMonth() + 1 >= 10 ? new Date(item.createTime).getMonth() + 1 : '0' + ( new Date(item.createTime).getMonth() + 1 )
                                                }-${
                                                new Date(item.createTime).getDate() >= 10 ? new Date(item.createTime).getDate() : '0' + ( new Date(item.createTime).getDate() )
                                                } ${
                                                new Date(item.createTime).getHours() >= 10 ? new Date(item.createTime).getHours() : '0' + ( new Date(item.createTime).getHours() )
                                                }:${
                                                new Date(item.createTime).getMinutes() >= 10 ? new Date(item.createTime).getMinutes() : '0' + ( new Date(item.createTime).getMinutes() )
                                                }`
                                        }
                                    </div>
                                    <div className={`main-info ${ item.userStatus ? '' : 'mein' } picture clear`}>
                                        <div className="portrait">
                                            <img src={ item.profilePhoto } width="100%" />
                                        </div>
                                        <div className="content">
                                            <div className="image"><img width="100%" src={ item.content } /></div>
                                        </div>
                                    </div>
                                </li>
                            )
                        }
                    })
                }
            </ul>
        );
    }
}
export default ChatList;