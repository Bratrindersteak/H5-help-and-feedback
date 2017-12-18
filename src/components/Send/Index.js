import React from 'react';
import Description from '../../containers/Send/Description';
import Contact from '../../containers/Send/Contact';
import Send from '../../containers/Send/Send';
import Layer from '../../containers/Send/Layer';

let send;

const Index = ({ display, onTouchStart }) => (
    <div className="send" style={{ display: display, height: display.height, }} ref={ (node) => { send = node } }>
        <div className="edit">
            <Description send={ send } />
            <Contact />
            <Send />
        </div>
        <Layer />
    </div>
);

export default Index;