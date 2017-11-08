import React from 'react';
import { textarea } from './Description';
import { input } from './Contact';

const Send = ({ text, sendFeedback }) => (
    <div className="edit-btn"><button type="button" onClick={ () => sendFeedback(textarea, input) }>{ text.text }</button></div>
);

export default Send;
