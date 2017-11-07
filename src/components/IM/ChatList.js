import React, { Component } from 'react';

const ChatList = () => (
    <ul className="message-list iscroll">
        <li className="message-box">
            <div className="time-info">2017-11-02 19:35</div>
            <div className="main-info text clear">
                <div className="portrait">
                    <img src={require('../../img/portrait.png')} width="100%" />
                </div>
                <div className="content">
                    <p className="info">kfgdklkldlkg</p>
                </div>
            </div>
        </li>
        <li className="message-box">
            <div className="time-info">2017-11-02 19:35</div>
            <div className="main-info picture clear">
                <div className="portrait">
                    <img src={require('../../img/portrait.png')} width="100%" />
                </div>
                <div className="content">
                    <div className="image"><img width="100%" src={require('../../img/image.png')} /></div>
                </div>
            </div>
        </li>
        <li className="message-box">
            <div className="time-info">2017-11-02 19:35</div>
            <div className="main-info mein text clear">
                <div className="portrait">
                    <img src={require('../../img/portrait.png')} width="100%" />
                </div>
                <div className="content">
                    <p className="info">dlsgkldflfklsfdkl</p>
                </div>
            </div>
        </li>
        <li className="message-box">
            <div className="time-info">2017-11-02 19:35</div>
            <div className="main-info mein picture clear">
                <div className="portrait">
                    <img src={require('../../img/portrait.png')} width="100%" />
                </div>
                <div className="content">
                    <div className="image"><img width="100%" src={require('../../img/image.png')} /></div>
                </div>
            </div>
        </li>
    </ul>
);

export default ChatList;