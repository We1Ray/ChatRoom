import React from 'react';
import ContentWrapper from '@/components/Layout/ContentWrapper';

// https://nextjs.org/docs/#custom-error-handling
class Error extends React.Component {
    static getInitialProps({ res, err }) {
        const statusCode = res ? res.statusCode : err ? err.statusCode : null;
        return {
            namespacesRequired: ['translations'],
            statusCode
        };
    }

    render() {
        return (
            <ContentWrapper>
                {this.props.statusCode
                    ? `An error ${this.props.statusCode} occurred on server`
                    : 'An error occurred on client'}
            </ContentWrapper>
        );
    }
}

export default Error;
