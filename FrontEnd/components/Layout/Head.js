import React from 'react';
import NextHead from 'next/head';
import PropTypes from 'prop-types';

const defaultDescription = '';

const Head = props => (
    <NextHead>
        <meta charSet="UTF-8" />
        <title>System Management Platform</title>
        <meta name="description" content={props.description || defaultDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/static/img/icon.png" />
    </NextHead>
);

Head.propTypes = {
    description: PropTypes.string
};

export default Head;
