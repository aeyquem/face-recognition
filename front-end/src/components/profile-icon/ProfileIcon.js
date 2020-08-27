import React, { Component } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import './ProfileIcon.css'

export default class ProfileIcon extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isToggled: false
        }
    }

    toggle = () => this.setState(prevState => ({
        isToggled: !prevState.isToggled
    }))

    render() {
        return (
            <div className="pa4 tc">
                <Dropdown isOpen={this.state.isToggled} toggle={this.toggle}>
                    <DropdownToggle
                        tag="span"
                        data-toggle="dropdown"
                        aria-expanded={this.state.isToggled}
                    >
                        <img
                            src="http://tachyons.io/img/avatar_1.jpg"
                            className="br-100 ba h3 w3 dib" alt="avatar" />
                    </DropdownToggle>
                    <DropdownMenu
                        right
                        className="b--transparent shadow-5 profile-dropdown mt3 bg-white-50">
                        <DropdownItem onClick={this.props.toggleModal}>View Profile</DropdownItem>
                        <DropdownItem onClick={() => this.props.onRouteChange('signOut')}>Sign Out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        )
    }
}
