import React, { Component } from 'react';
import Subhead from './Subhead';
import Items from './Items';
import CONTACT_US from '../../jsons/contactUS.json';

const ContactUS = () => (
    <div className="contact-us">
        {
            CONTACT_US.map((item) => {
                return (
                    <section key={ item.label } className="contact-us-module">
                        { item.label ? <Subhead label={ item.label } /> : '' }
                        <Items items={ item.children } />
                    </section>
                )
            })
        }
    </div>
);

export default ContactUS;
