import React from 'react';
import Description from '../../containers/Send/Description';
import Contact from '../../containers/Send/Contact';
import Statement from '../../containers/Send/Statement';
import Send from '../../containers/Send/Send';

const Index = () => (
    <div className="edit">
        <Description />
        <Contact />
        <Statement />
        <Send />
    </div>
);

export default Index;