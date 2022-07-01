import React from 'react';
import Head from './Head';

const BasePage = props => (
    <>
        <Head />
        <div className="wrapper">{props.children}</div>
    </>
);

export default BasePage;
