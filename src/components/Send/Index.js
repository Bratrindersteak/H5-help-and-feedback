import React from 'react';
import Description from '../../containers/Send/Description';
import Contact from '../../containers/Send/Contact';
import Send from '../../containers/Send/Send';

let send;

const Index = ({ display, onTouchStart }) => (
    <div className="send" style={{ display: display }} ref={ (node) => { send = node } }>
        <div className="alpha" onTouchStart={ () => onTouchStart() }></div>
        <div className="edit">
            <Description send={ send } />
            <Contact />
            <Send />
        </div>
    </div>
);

export default Index;