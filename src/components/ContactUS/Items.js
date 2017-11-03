import React, { Component } from 'React';
import Item from './Item';

const Items = ({ items }) => (
    <ul className="contact-items">
        {
            items.map((item, index) => {
                return (
                    <Item key={ index.toString() } item={ item } />
                )
            })
        }
    </ul>
);

export default Items;