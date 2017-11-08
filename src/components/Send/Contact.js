import React from 'react';

let input;

const Contact = ({ text, writeContact }) => {
    return (
        <div className="text-block">
            <input type="text" maxLength={ text.maxLength } placeholder={ text.placeholder } ref={ (node) => { input = node } } onChange={ () => writeContact(input) } />
        </div>
    )
};

export { input, Contact };
