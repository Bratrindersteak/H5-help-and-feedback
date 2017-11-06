import React from 'react';

const Send = ({ text, sendFeedback }) => (
    <div className="edit-btn"><button type="button" onClick={ sendFeedback }>{ text.text }</button></div>
);

export default Send;
