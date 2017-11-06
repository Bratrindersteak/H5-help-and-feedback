import React from 'react';

const Contact = ({ text, writeContact }) => {
    let input;

    return (
        <div className="text-block">
            <input type="text" maxLength={ text.maxLength } placeholder={ text.placeholder } ref={ (node) => { input = node } } onChange={ () => writeContact(input) } />
        </div>
    )
};

export default Contact;
