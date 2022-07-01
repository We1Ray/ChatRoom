// FULLSCREEN
// -----------------------------------
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import screenfull from 'screenfull';

const FULLSCREEN_ON_ICON = 'fa fa-expand';
const FULLSCREEN_OFF_ICON = 'fa fa-compress';

/**
 * Wrapper for screenfull plugin
 * Wraps child element and toggles
 * fullscreen mode on click
 */
export default class ToggleFullscreen extends Component {
    static propTypes = {
        /** tag to use, defaults to A */
        tag: PropTypes.string
    };

    static defaultProps = {
        tag: 'a'
    };

    state = {
        iconClass: FULLSCREEN_ON_ICON
    };

    componentDidMount() {
        this.fsToggler = this.element;

        // Not supported under IE
        const ua = window.navigator.userAgent;
        if (ua.indexOf('MSIE ') > 0 || !!ua.match(/Trident.*rv:11\./)) {
            this.fsToggler.style.display = 'none';
            return; // and abort
        }

        this.fsToggler.addEventListener('click', this.handleClisk);

        if (screenfull.raw && screenfull.raw.fullscreenchange)
            document.addEventListener(screenfull.raw.fullscreenchange, this.toggleFSIcon);
    }

    handleClisk = e => {
        e.preventDefault();

        if (screenfull.enabled) {
            screenfull.toggle();

            // Switch icon indicator
            this.toggleFSIcon();
        } else {
            console.log('Fullscreen not enabled');
        }
    };

    toggleFSIcon = () => {
        this.setState({
            iconClass: screenfull.isFullscreen ? FULLSCREEN_OFF_ICON : FULLSCREEN_ON_ICON
        });
    };

    componentWillUnmount() {
        this.fsToggler.removeEventListener('click', this.handleClisk);
        document.removeEventListener(screenfull.raw.fullscreenchange, this.toggleFSIcon);
    }

    setRef = node => {
        this.element = node;
    };

    render() {
        const { tag: Tag } = this.props;
        return (
            <Tag ref={this.setRef} {...this.props}>
                <em className={this.state.iconClass} />
            </Tag>
        );
    }
}
