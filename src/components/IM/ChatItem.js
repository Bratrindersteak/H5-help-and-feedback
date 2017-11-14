import React from 'react';
import TimeBar from './TimeBar';
import Portrait from './Portrait';

const Text = ({ item, userInfo, week }) => (
    <li className="message-box">
        <TimeBar createTime={ item.createTime } week={ week } />
        <div className={`main-info ${ item.userStatus ? '' : 'mein' } text clear`}>
            <Portrait item={ item } userInfo={ userInfo } />
            <div className="content">
                <p className="info">{ item.content }</p>
            </div>
        </div>
    </li>
);

const Picture = ({ item, userInfo, week, picLoading }) => (
    <li className="message-box">
        <TimeBar createTime={ item.createTime } week={ week } />
        <div className={`main-info ${ item.userStatus ? '' : 'mein' } picture clear`}>
            <Portrait item={ item } userInfo={ userInfo } />
            <div className="content">
                <div className="image"><img width="100%" src={ item.content } onLoad={ () => window.scrollTo(0, document.body.clientHeight - window.outerHeight) } /></div>
            </div>
        </div>
    </li>
);

const Default = ({ item, userInfo, week }) => (
    <li className="message-box">
        <TimeBar createTime={ new Date() } week={ week } />
        <div className="main-info text clear">
            <Portrait item={ item } userInfo={ userInfo } />
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
);

export { Text, Picture, Default };