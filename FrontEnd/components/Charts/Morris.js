/* global Morris */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Wrapper for morris chart plugin
 */
class MorrisChart extends Component {
    static propTypes = {
        /** id of the container element */
        id: PropTypes.string.isRequired,
        /** data to display */
        data: PropTypes.array.isRequired,
        /** morris option object */
        options: PropTypes.object.isRequired,
        /** chart type */
        type: PropTypes.oneOf(['Line', 'Area', 'Donut', 'Bar']).isRequired
    };

    componentDidMount() {
        // Morris.js
        require('morris.js.so/morris.js');
        require('morris.js.so/morris.css');

        window.requestAnimationFrame(() => this.drawChart());
    }

    drawChart() {
        const element = { element: this.props.id };
        const data = { data: this.props.data };
        this.chart = new Morris[this.props.type]({
            ...element,
            ...data,
            ...this.props.options
        });
    }

    render() {
        return <div id={this.props.id} />;
    }
}

export default MorrisChart;
