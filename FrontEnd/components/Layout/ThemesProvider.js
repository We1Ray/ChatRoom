import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import all theme into main css chunk
// todo: import dynamically
import '../../styles/themes/theme-a.scss';
import '../../styles/themes/theme-b.scss';
import '../../styles/themes/theme-c.scss';
import '../../styles/themes/theme-d.scss';
import '../../styles/themes/theme-e.scss';
import '../../styles/themes/theme-f.scss';
import '../../styles/themes/theme-h.scss';

const ThemesProvider = props => (
    <div id="__themes_provider" className={props.theme.name}>
        {props.children}
    </div>
);

ThemesProvider.propTypes = {
    theme: PropTypes.object
};

export default connect(state => ({ theme: state.theme }))(ThemesProvider);
