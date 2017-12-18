import React from 'react';
import { textarea } from "../Send/Description";

const Send = ({onClick}) => (
    <div className="bottom-module unfinished" id="bottomModule">
        <div className="send-box" onClick={() => {
            // textarea.focus();

            return onClick();
        }}>
            <button type="button" className="icon chat" />
            <input className="input" id="contentInput" type="text" readOnly={ true }/>
        </div>
    </div>
);

export default Send;