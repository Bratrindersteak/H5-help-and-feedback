import React from 'react';
import TimeBar from './TimeBar';

const Text = ({item, userInfo, week}) => (
    <li className="message-box">
        <TimeBar createTime={ item.createTime } week={ week } />
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

const Picture = ({item, userInfo, week, picLoading}) => (
    <li className="message-box">
        <TimeBar createTime={ item.createTime } week={ week } />
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