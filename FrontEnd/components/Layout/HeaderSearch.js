import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HeaderSearch extends Component {
    componentDidMount() {
        document.addEventListener('keydown', this.closeNavSearchKey);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.closeNavSearchKey);
    }

    setInputSearch = isOpen => input => {
        if (input) input[isOpen ? 'focus' : 'blur']();
    };

    closeNavSearchKey = e => {
        if (e.keyCode === 27) this.props.onClose(e);
    };

    render() {
        const { isOpen, onClose } = this.props;
        return (
            <form
                className={'navbar-form ' + (isOpen ? 'open' : '')}
                role="search"
                action="search.html"
            >
                <div className="form-group">
                    <input
                        ref={this.setInputSearch(isOpen)}
                        className="form-control"
                        type="text"
                        placeholder="Type and hit enter ..."
                    />
                    <div className="fa fa-times navbar-form-close" onClick={onClose} />
                </div>
                <button className="d-none" type="submit">
                    Submit
                </button>
            </form>
        );
    }
}

HeaderSearch.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func
};

export default HeaderSearch;
