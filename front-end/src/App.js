import ImageLinkForm from './components/image-link-form/ImageLinkForm';
import React, { Component, Fragment } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/face-recognition/FaceRecognition';
import Particles from 'react-particles-js';
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'
import Modal from './components/Modal/Modal'
import Profile from './components/profile/Profile';

const particlesOptions = {
  particles: {
    line_linked: {
      shadow: {
        enable: true,
        color: "#0000ff",
        blur: 5
      }
    }
  }
}

const initialState = {
  input: '',
  imgUrl: '',
  box: [],
  route: 'signIn',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imgUrl: '',
      box: [],
      route: 'signIn',
      isSignedIn: false,
      isProfileOpen: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem('token')
    if (token) {
      fetch(`${process.env.REACT_APP_API_URL}/signin`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            this.getUser(data.id, token)
          }
        })
        .catch(console.log)
    }
  }

  getUser = (id, token) => {
    fetch(`${process.env.REACT_APP_API_URL}/profile/${id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })
      .then(res => res.json())
      .then(user => {
        if (user && user.email) {
          this.loadUser(user);
          this.onRouteChange('home');
        }
      })
      .catch(console.log);
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    const clafifaiFace = data.outputs[0].data.regions;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return clafifaiFace.map(region => {
      const boundingBox = region.region_info.bounding_box;
      return {
        leftCol: boundingBox.left_col * width,
        topRow: boundingBox.top_row * height,
        rightCol: width - (boundingBox.right_col * width),
        bottomRow: height - (boundingBox.bottom_row * height)
      }
    })
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onButtonClick = (event) => {
    console.log("user id " + this.state.user.id);

    this.setState({ imgUrl: this.state.input });
    fetch(`${process.env.REACT_APP_API_URL}/imageurl`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': window.sessionStorage.getItem('token')
      },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch(`${process.env.REACT_APP_API_URL}/image`, {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signOut') {
      this.setState(initialState);
    }
    else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }

    this.setState({ route: route });
  }

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  render() {

    const { isSignedIn, box, imgUrl, route, isProfileOpen, user } = this.state;

    let componentsToRender;

    switch (route) {
      case 'signIn':
      case 'signOut':
        componentsToRender = <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} getUser={this.getUser}></SignIn>
        break;

      case 'register':
        componentsToRender = <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}></Register>
        break;

      case 'home':
      default:
        componentsToRender =
          <Fragment>
            <Logo></Logo>
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonClick={this.onButtonClick}></ImageLinkForm>
            <FaceRecognition boxes={box} imgUrl={imgUrl}></FaceRecognition>
          </Fragment>
        break;
    }

    return (
      <div className="App" >
        <Particles className="particles"
          params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} loadUser={this.loadUser} toggleModal={this.toggleModal}></Navigation>
        {
          isProfileOpen &&
          <Modal>
            <Profile user={user} toggleModal={this.toggleModal} loadUser={this.loadUser} />
          </Modal>
        }
        {componentsToRender}
      </div>
    );
  }
}

export default App;
