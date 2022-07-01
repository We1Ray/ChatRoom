import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../store/actions/actions';

import Head from './Head';
import HeaderHorizontal from './HeaderHorizontal';
import Offsidebar from './Offsidebar';
import Footer from './Footer';
import SettingsProvider from './SettingsProvider';
import ThemesProvider from './ThemesProvider';

class BaseHorizontal extends Component {
    /* Toggle Horizontal layout for demo purposes.
        Set the 'horizontal' flag using redux in the settingsReducer
        and remove bwloe methods so it gets rendered on the server
    */
    componentWillMount = () => this.props.actions.changeSetting('horizontal', true);
    componentWillUnmount = () => this.props.actions.changeSetting('horizontal', false);

    render() {
        return (
            <ThemesProvider>
                <SettingsProvider>
                    <div className="wrapper">
                        <Head />

                        <HeaderHorizontal />

                        <Offsidebar />

                        <section className="section-container">{this.props.children}</section>

                        <Footer />
                    </div>
                </SettingsProvider>
            </ThemesProvider>
        );
    }
}

BaseHorizontal.propTypes = {
    actions: PropTypes.object,
    settings: PropTypes.object
};

const mapStateToProps = state => ({ settings: state.settings });
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) });

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BaseHorizontal);
