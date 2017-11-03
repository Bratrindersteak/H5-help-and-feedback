import React, { Component } from 'react';

const Send = () => (
    <div className="bottom-module unfinished" id="bottomModule">
        <div className="send-box up" id="sendBox">
            <button type="button" className="shift to-menu"></button>
            <input className="input" id="contentInput" type="text" maxLength="300" />
            <label className="send" htmlFor="uploadPic"></label>
            <input className="send" id="uploadPic" type="file" multiple="multiple" accept="image/*" />
        </div>
        <div className="menu down" id="menuBox">
            <button type="button" className="shift to-send"></button>
            <button type="button" className="trash-all" id="trashAll"></button>
        </div>
    </div>
);

export default Send;