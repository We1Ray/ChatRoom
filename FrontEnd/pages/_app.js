/*!
 *
 * Angle - Bootstrap Admin Template
 *
 * Version: 4.7.5
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 *
 */

// Polyfills
// ======================
import '../polyfills.js';

// App
// ======================
import App from 'next/app';
import React from 'react';
// Redux support
import { Provider } from 'react-redux';
import withReduxStore from '../store/with-redux-store';
// Translation support
import * as Translate from '@/components/Common/Translate';
// Base Layout
import Base from '@/components/Layout/Base';
// import BaseHorizontal from '@/components/Layout/BaseHorizontal';

// Global Vendor
// ======================
// Whirl
import 'whirl/dist/whirl.css';
// Font Awesome
import '@fortawesome/fontawesome-free/css/brands.css';
import '@fortawesome/fontawesome-free/css/regular.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
// Animate.CSS
import 'animate.css/animate.min.css';
// Simple line icons
import 'simple-line-icons/css/simple-line-icons.css';
// Weather Icons
import 'weather-icons/css/weather-icons.min.css';
import 'weather-icons/css/weather-icons-wind.min.css';

// App Styes
// ======================
import '../styles/bootstrap.scss';
import '../styles/app.scss';

// https://nextjs.org/docs/#custom-app
class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        // Require the initial dictionary.
        // Use require to avoid 'fs' module
        Translate.setDict('en', require('@/public/static/locales/en/translations.json'));
        // The store has been updated in previous call,
        // pass it down as initial prop so client can use it.
        return { pageProps, store: Translate.store };
    }

    render() {
        const { Component, pageProps, reduxStore, store } = this.props;
        const Layout = Component.Layout ? Component.Layout : Base;
        const ComponentWithTranslation = Translate.withTranslation(Component);
        return (
            <Provider store={reduxStore}>
                <Translate.Provider store={store}>
                    <Layout>
                        <ComponentWithTranslation {...pageProps} />
                    </Layout>
                </Translate.Provider>
            </Provider>
        );
    }
}

export default withReduxStore(MyApp);
