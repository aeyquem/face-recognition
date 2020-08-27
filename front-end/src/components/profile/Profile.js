import React from 'react'
import './Profile.css'
import { Component } from 'react'

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.user.name,
            email: props.user.email
        }
    }

    onFormChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value })
    }

    onFormSubmit = (data) => {
        const { loadUser, toggleModal } = this.props;
        console.log("data: ")
        console.log(data)
        fetch(`${process.env.REACT_APP_API_URL}/profile/${this.props.user.id}`, {
            method: 'POST',
            body: JSON.stringify({ formInput: data }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.sessionStorage.getItem('token')
            }
        })
            .then(res => {
                toggleModal();
                loadUser({ ...this.props.user, ...data })
            })
            .catch(console.log)
    }

    render() {
        const { toggleModal, user } = this.props;
        const { name, email } = this.state;
        return (
            <div className="profile-modal">
                <div className="relative pa4 bg-white-80">
                    <div className="profile-summary tc">
                        <img
                            src="http://tachyons.io/img/avatar_1.jpg"
                            className="br-100 ba h3 w3 dib" alt="avatar" />
                        <h1 className="ma0">{this.state.name}</h1>
                        <p className="ma0">Images submitted: {user.entries}</p>
                        <p>Member since: {new Date(user.joined).toLocaleDateString()}</p>
                    </div>
                    <div className="mv4">
                        <div className="flex">
                            <span>Name: </span>
                            <input type="text" name="name" placeholder={user.name} onChange={this.onFormChange} />
                        </div>
                        <div className="flex">
                            <span>Email: </span>
                            <input type="email" name="email" placeholder={user.email} onChange={this.onFormChange} />
                        </div>
                    </div>
                    <div className="flex justify-between mt2">
                        <button onClick={toggleModal} className="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20">Cancel</button>
                        <button onClick={() => this.onFormSubmit({ name, email })} className="b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20">Save</button>
                    </div>
                    <div onClick={toggleModal} className="absolute top-0 right-0 white bg-dark-gray w2 pvs tc pointer">&times;</div>
                </div>
            </div>
        )
    }
}

export default Profile
