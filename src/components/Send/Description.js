import React from 'react';

let files, textarea;

const Description = ({ text, writeDescription, uploadPic }) => {
    return (
        <div className="text-block textarea">
            <textarea maxLength={ text.count.total } placeholder={ text.textarea.placeholder } ref={ (node) => { textarea = node } } onChange={ () => writeDescription(textarea) }></textarea>
            <label className="upload-pic" htmlFor="uploadPic">{ text.picture.text }</label>
            <input type="file" id="uploadPic" accept="image/*" ref={ (node) => { files = node } } onChange={ (event) => uploadPic(event.target.files) } />
            <span className="count"><i id="wordCount">{ text.count.current }</i>/{ text.count.total }</span>
        </div>
    )
};

export { files, textarea, Description };
