import React from 'react';

let img, files, textarea;

const Description = ({ text, sendBox, writeDescription, uploadPic, deletePic }) => {
    return (
        <div className="text-block textarea">
            <textarea value={ text.textarea.value } maxLength={ text.count.total } placeholder={ text.textarea.placeholder } ref={ (node) => { textarea = node } } onChange={ () => writeDescription(textarea) } onFocus={ () => {
                setTimeout(() => {
                    sendBox.scrollIntoViewIfNeeded(true)
                }, 1000)
            } } />

            {
                text.picture.src
                    ?
                <div className="preview">
                    <i className="delete-icon" onTouchEnd={ () => deletePic(img.src) }></i>
                    <img className="upload-pic" src={ text.picture.src } ref={ (node) => img = node } />
                </div>
                    :
                <div className="file">
                    <label className="upload-pic" htmlFor="uploadPic">{ text.picture.text }</label>
                    <input type="file" id="uploadPic" accept="image/*" ref={ (node) => { files = node } } onChange={ (event) => uploadPic(event.target.files) } />
                </div>
            }

            <span className="count"><i id="wordCount">{ text.count.current }</i>/{ text.count.total }</span>
        </div>
    )
};

export { img, files, textarea, Description };
