import React from 'react';
import TimeBar from './TimeBar';
import Portrait from './Portrait';

import Action from '../../js/base/action';

const Log = ({ item, userInfo, week }) => (
    <li className="message-box">
        <TimeBar createTime={ item.createTime } week={ week } />
        <div className={`main-info ${ item.userStatus ? '' : 'mein' } text clear`}>
            <Portrait item={ item } userInfo={ userInfo } />
            {/*<div className="content" onClick={ () => Action.sendAction({*/}
                {/*action: '2.7',*/}
                {/*ex1: 4,*/}
                {/*ex2: 1,*/}
            {/*}) }>*/}
            <div className="content" onClick={ () => window.location.href = Action.makeActionUrl('sva://action.cmd?action=2.7&ex1=4&ex2=1') }>
                <p className="info">{ decodeURI(item.content) }</p>
            </div>
        </div>
    </li>
);

const Text = ({ item, userInfo, week }) => (
    <li className="message-box">
        <TimeBar createTime={ item.createTime } week={ week } />
        <div className={`main-info ${ item.userStatus ? '' : 'mein' } text clear`}>
            <Portrait item={ item } userInfo={ userInfo } />
            <div className="content">
                <p className="info">{ decodeURI(item.content) }</p>
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

const Default = ({ item, userInfo, week, nav }) => (
    <li className="message-box">
        <TimeBar createTime={ new Date() } week={ week } />
        <div className="main-info text clear">
            <Portrait item={ item } userInfo={ userInfo } />
            <div className="content">
                <p className="info">来啦～～随便坐啊</p>
                <p className="info">下面的热点问题是小狐精心准备的，看看能解决您的问题不？</p>
                {
                    nav.map((item) => {

                        if (item.name !=='热点问题' && item.name !=='联系我们') {
                            return <a href={ `./list.html?id=${ item.id }&sver=${ userInfo.sver }&plat=${ userInfo.plat }` } className="nav-link">{ item.name }</a>;
                        }
                    })
                }
                <p className="info">如果仍然无法解决，可以直接输入你的问题，小狐狸帮您看看！</p>
            </div>
        </div>
    </li>
);

export { Log, Text, Picture, Default };