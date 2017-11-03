import React, { Component } from 'react';

const Edit = () => (
    <div className="edit">
        <div className="text-block textarea">
            <textarea className="" id="" placeholder="请详细描述问题的操作步骤或建议"></textarea>
            <label className="upload-pic" htmlFor="uploadPic">添加图片</label>
            <input type="file" id="uploadPic" />
            <span className="count"><i id="wordCount">0</i>/150</span>
        </div>
        <div className="text-block">
            <input type="number" id="contactWay" placeholder="请输入您的电话/QQ" />
        </div>
        <p className="statement">我们会确保您的隐私安全，请放心填写电话，我们仅  在必要时联系您，寻求您的有偿帮助。</p>
        <div className="edit-btn"><button type="button">发送</button></div>
    </div>
);

export default Edit;
