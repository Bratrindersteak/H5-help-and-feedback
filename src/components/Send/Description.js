import React from 'react';

const Description = ({ text, writeDescription, uploadPic }) => {
    let textarea;

    return (
        <div className="text-block textarea">
            <textarea maxLength={ text.count.total } placeholder={ text.textarea.placeholder } ref={ (node) => { textarea = node } } onChange={ () => writeDescription(textarea) }></textarea>
            <label className="upload-pic" htmlFor="uploadPic">{ text.picture.text }</label>
            <input type="file" id="uploadPic" onChange={ uploadPic } />
            <span className="count"><i id="wordCount">{ text.count.current }</i>/{ text.count.total }</span>
        </div>
    )
};

export default Description;
