import React from 'react';
import { textarea } from "./Description";
import { input } from "./Contact";

const Layer = ({ onTouchStart }) => (
    <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    }} onTouchStart={() => {
        textarea.blur();
        input.blur();

        return onTouchStart();
    }} />
);

export default Layer;