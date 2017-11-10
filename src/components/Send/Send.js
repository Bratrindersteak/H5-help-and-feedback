import React from 'react';
import { textarea, img } from './Description';
import { input } from './Contact';

const Send = ({ text, sendFeedback }) => (
    <div className="edit-send">
        <p className="statement">{ text.statement }</p>
        <button className="btn" type="button" onClick={ () => sendFeedback(textarea, img, input) }>{ text.btn.text }</button>
    </div>
);

export default Send;