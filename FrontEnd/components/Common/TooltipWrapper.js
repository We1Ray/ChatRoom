import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';

// track id generation
let idCounter = 0;
// return unique id number
const UUID = () => idCounter++;
// reset to sync client/server rendering
export const resetUUID = () => idCounter = 0;

/**
 * Wrap an element and assign automatically an ID,
 * creates a handler to show/hide tooltips without
 * the hassle of creating new states and class methods.
 * Support only one child and simple text content.
 */

class TooltipWrapper extends Component {
    // static propTypes { content: PropTypes.string }
    state = {
        _id: 'id4tooltip_' + UUID(),
        tooltipOpen: false
    };
    toggle = e => {
        this.setState({ tooltipOpen: !this.state.tooltipOpen });
    };
    render() {
        return [
            <Tooltip
                {...this.props}
                isOpen={this.state.tooltipOpen}
                toggle={this.toggle}
                target={this.state._id}
                placement={this.props.placement}
                key="1"
            >
                {this.props.content}
            </Tooltip>,
            React.cloneElement(React.Children.only(this.props.children), {
                id: this.state._id,
                key: '2'
            })
        ];
    }
}

export default TooltipWrapper;
