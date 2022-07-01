import $ from 'jquery';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import deepEqual from 'deep-equal';

import './chart-flot.scss';

/**
 * Wrapper component for jquery-flot plugin
 */
class FlotChart extends Component {
    static propTypes = {
        /** data to display */
        data: PropTypes.array.isRequired,
        /** flot options object */
        options: PropTypes.object.isRequired,
        /** height of the container element */
        height: PropTypes.string,
        /** width of the container element */
        width: PropTypes.string
    }

    static defaultProps = {
        height: null,
        width: '100%'
    }

    componentDidMount() {

        // Flot Charts
        require('flot/jquery.flot.js');
        require('flot/jquery.flot.categories.js');
        require('flot/jquery.flot.pie.js');
        require('flot/jquery.flot.resize.js');
        require('flot/jquery.flot.time.js');
        require('jquery.flot.spline/jquery.flot.spline.js');
        require('jquery.flot.tooltip/js/jquery.flot.tooltip.min.js');

        setTimeout(() => {
            this.drawChart();
        }, 100);
    }

    componentWillReceiveProps(nextProps) {
        if (!deepEqual(nextProps.data, this.props.data) || !deepEqual(nextProps.options, this.props.options)) {
            this.drawChart(nextProps);
        }
    }

    componentWillUnmount() {
        $(this.flotElement).data('plot').shutdown();
    }

    drawChart(nextProps) {
        const data = (nextProps && nextProps.data) || this.props.data;
        const options = (nextProps && nextProps.options) || this.props.options;
        $.plot(this.flotElement, data, options);
    }

    setRef = node => {
        this.flotElement = node;
    }

    render() {
        const style = {
            height: this.props.height,
            width: this.props.width
        };

        return (
            <div ref={this.setRef} style={style} {...this.props}/>
        );
    }
}

export default FlotChart;