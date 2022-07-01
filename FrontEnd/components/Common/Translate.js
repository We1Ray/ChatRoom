import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_LANGUAGE = 'en';
const LANGUAGES_PATH = 'static/locales';
const LANGUAGES_FILE = 'translations.json';
const VARIABLE_REGEX = /\{([^}]+)\}/g;

export const store = {
    /* dictionaries */
};

/**
 * Set a dictionary for a specific language
 * @param  {String} lang language
 * @param  {Object} data dictionary
 * @return {Object}      dictionary added
 */
export const setDict = (lang, data) => (store[lang] = data);

/**
 * Get a dictionary for specific language
 * @param  {String} lang language
 * @return {Object}      dictionary
 */
export const getDict = lang => store[lang];

/**
 * Fetch a dictionary for specific language defined in JSON format
 * @param  {Strong} lang language
 * @return {Object}      dictionary loaded
 */
export const fetchStore = async lang => {
    if (!store[lang]) {
        const res = await fetch(`/${LANGUAGES_PATH}/${lang}/${LANGUAGES_FILE}`);
        store[lang] = await res.json();
    }
    return store[lang];
};

/**
 * Interpolates values given in 'params'
 * @param  {String} str    text
 * @param  {Object} params object to interpolate
 * @return {String}
 */
const compile = (str = '', params) => {
    const matches = str.match(VARIABLE_REGEX);
    if (matches) {
        matches
            .map(v => v.replace(/\{|\}/g, ''))
            .forEach(v => (str = str.replace('{' + v + '}', params[v])));
    }
    return str;
};

/**
 * Reads an object value using dot notation for nested keys
 * @param  {Object} obj  object to parse
 * @param  {String} skey key to search
 * @return {String|null}
 */
export const accessKey = (obj, skey = '') => skey.split('.').reduce((a, b) => a && a[b], obj);

/**
 * Returns the translated text for given key and interpolates values in 'params'
 * @param  {String} key    the key to search for
 * @param  {String} lang   language
 * @param  {Object} params object with params to interpolate
 * @return {[type]}        [description]
 */
export const translateKey = (key, lang, params = {}) => compile(accessKey(getDict(lang), key));

// =====================
// REACT INTERFACE
// =====================

/**
 * Context used to handle translation in the component tree
 */
const TranslateContext = React.createContext({
    language: DEFAULT_LANGUAGE,
    changeLanguage: () => {}
});

/**
 * Component provider to pass down context to child components
 * Must be used to wrap application
 */
export class Provider extends React.Component {
    changeLanguage = language => {
        fetchStore(language).then(() => {
            this.setState(state => ({
                language
            }));
        });
    };

    state = {
        language: DEFAULT_LANGUAGE,
        changeLanguage: this.changeLanguage
    };

    constructor(props) {
        super(props);
        if (props.store) {
            Object.keys(props.store).forEach(l => setDict(l, props.store[l]));
        }
    }

    render() {
        return (
            <TranslateContext.Provider value={this.state}>
                {this.props.children}
            </TranslateContext.Provider>
        );
    }
}

/**
 * HOC to provide 'changeLanguage' and 't' method to WrappedComponent
 */
export function withTranslation(WrappedComponent) {
    return function TranslatedComponent(props) {
        const { language, changeLanguage } = useContext(TranslateContext);
        const t = (k, l, p) => translateKey(k, l || language, p);
        return <WrappedComponent changeLanguage={changeLanguage} t={t} {...props} />;
    };
}

/**
 * Component to translate a given key
 * If key is missing, render children without changes
 */
export const Trans = props => {
    const { language } = useContext(TranslateContext);
    const { i18nKey, lang, params, children } = props;
    return [translateKey(i18nKey, lang || language, params) || children];
};

Trans.proptypes = {
    i18nKey: PropTypes.string.isRequired,
    lang: PropTypes.string,
    params: PropTypes.object
};
