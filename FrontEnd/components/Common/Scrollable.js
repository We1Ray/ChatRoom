// SLIMSCROLL
// -----------------------------------
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Perfect Scrollbar
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

// ensure rails are shown over the rest
const fixRailsZIndex = '.ps__rail-y, ps__rail-x {z-index: 999999; }';

const Scrollable = props => {
    const scrollStyle = {
        position: 'relative'
    };
    if (props.height !== null) {
        scrollStyle.height = props.height;
    }
    return (
        <>
            <style>{fixRailsZIndex}</style>
            <PerfectScrollbar {...props} style={scrollStyle}>
                {props.children}
            </PerfectScrollbar>
        </>
    );
};

Scrollable.propTypes = {
    /** height of the element */
    height: PropTypes.string
};

Scrollable.defaultProps = {
    height: '250px'
};

export default Scrollable;
