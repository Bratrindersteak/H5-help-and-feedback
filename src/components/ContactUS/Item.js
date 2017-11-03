import React, { Component } from 'React';

const Item = ({ item }) => (
    <li className="info">
        <h6 className={`label ${ item.label.isMarked ? 'fold' : '' }`}>{ item.label.text }</h6>
        <ul className="children">{ item.children.map((item) => <li key={ item.label } className={`child ${item.isMarked ? 'marked' : ''}`}>{ item.label }</li>) }</ul>
    </li>
);

export default Item;