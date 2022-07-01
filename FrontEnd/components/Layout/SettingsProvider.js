import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const getClasses = settings => {
    let c = [];

    if (settings.isFixed) c.push('layout-fixed');
    if (settings.isBoxed) c.push('layout-boxed');
    if (settings.isCollapsed) c.push('aside-collapsed');
    if (settings.isCollapsedText) c.push('aside-collapsed-text');
    if (settings.isFloat) c.push('aside-float');
    if (settings.asideHover) c.push('aside-hover');
    if (settings.offsidebarOpen) c.push('offsidebar-open');
    if (settings.asideToggled) c.push('aside-toggled');
    // layout horizontal
    if (settings.horizontal) c.push('layout-h');

    return c.join(' ');
};

const SettingsProvider = props => (
    <div id="__settings_provider" className={getClasses(props.settings)}>
        {props.children}
    </div>
);

SettingsProvider.propTypes = {
    settings: PropTypes.object
};

export default connect(
    state => ({ settings: state.settings })
)(SettingsProvider);
