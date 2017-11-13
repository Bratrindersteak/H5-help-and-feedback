import React, { Component } from 'react';

const Text = ({item, userInfo}) => (
    <li className="message-box">
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
                {
                    !item.profilePhoto && !item.userStatus ? <img src={ userInfo.userImg } width="100%" /> : <img src={ item.profilePhoto } width="100%" />
                }
            </div>
            <div className="content">
                <p className="info">{ item.content }</p>
            </div>
        </div>
    </li>
);

const Picture = ({item, userInfo, picLoading}) => (
    <li className="message-box">
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
                {
                    !item.profilePhoto && !item.userStatus ? <img src={ userInfo.userImg } width="100%" /> : <img src={ item.profilePhoto } width="100%" />
                }
            </div>
            <div className="content">
                <div className="image"><img width="100%" src={ item.content } onLoad={ () => window.scrollTo(0, document.body.clientHeight - window.outerHeight) } /></div>
            </div>
        </div>
    </li>
);

export { Text, Picture };