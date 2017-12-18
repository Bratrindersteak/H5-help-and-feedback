import React from 'react';

let input;

const Contact = ({ text, writingContact, rewritingContact, focus }) => {
    return (
        <div className="text-block">
            <input value={ text.value } autoFocus={ true } type="text" maxLength={ text.maxLength } placeholder={ text.placeholder } style={{ color: text.color }} ref={ (node) => { input = node } } onChange={ () => writingContact(input) } onFocus={ (event) => {

                if (event.target.style.color) {
                    rewritingContact();
                }

                focus();

                // setTimeout(() => {
                //     input.scrollIntoViewIfNeeded(true)
                // }, 600);
            } } />
        </div>
    )
};

export { input, Contact };
