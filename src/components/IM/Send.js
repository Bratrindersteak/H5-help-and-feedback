import React, { Component } from 'react';

const Send = ({onClick}) => (
    <div className="bottom-module unfinished" id="bottomModule">
        <div className="send-box" onClick={ onClick }>
            <button type="button" className="icon chat"></button>
            <input className="input" id="contentInput" type="text" readOnly={ true }/>
        </div>
    </div>
);

export default Send;