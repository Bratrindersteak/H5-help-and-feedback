import React from 'react';

let img, files, textarea;

const Description = ({ text, sendBox, writingDescription, rewritingDescription, uploadPic, deletePic, focus }) => {
    return (
        <div className="text-block textarea">
            <textarea value={ text.textarea.value } maxLength={ text.count.total } placeholder={ text.textarea.placeholder } style={{ color: text.textarea.color }} ref={ (node) => { textarea = node } } onChange={ () => writingDescription(textarea) } onFocus={ (event) => {

                if (event.target.style.color) {
                    rewritingDescription();
                }

                focus();

                // setTimeout(() => {
                //     textarea.scrollIntoViewIfNeeded(true)
                // }, 600);
            } } />

            {
                text.picture.src
                    ?
                <div className="preview">
                    <i className="delete-icon" onTouchEnd={ () => deletePic(img.src) } />
                    <img className="upload-pic" src={ text.picture.src } ref={ (node) => img = node } />
                </div>
                    :
                <div className="file">
                    <label className="upload-pic" htmlFor="uploadPic">{ text.picture.text }</label>
                    <input type="file" id="uploadPic" accept="image/*" ref={ (node) => { files = node } } onChange={ (event) => uploadPic(event.target.files, textarea.style.color) } />
                </div>
            }

            <span className="count"><i id="wordCount">{ text.count.current }</i>/{ text.count.total }</span>
        </div>
    )
};

export { img, files, textarea, Description };
