import React from 'react';
import Description from '../../containers/Send/Description';
import Contact from '../../containers/Send/Contact';
import Statement from '../../containers/Send/Statement';
import Send from '../../containers/Send/Send';

const Index = ({ display }) => (
    <div className="edit" style={{ display: display }}>
        <Description />
        <Contact />
        <Statement />
        <Send />
    </div>
);

export default Index;