import ImageLinkForm from './components/image-link-form/ImageLinkForm';
import React, { Component, Fragment } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/face-recognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'


const app = new Clarifai.App({
  apiKey: '65715e9b297148bbb66e5893d3e589da'
});

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

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imgUrl: '',
      box: {},
      route: 'signIn',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: 0,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    const clafifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clafifaiFace.left_col * width,
      topRow: clafifaiFace.top_row * height,
      rightCol: width - (clafifaiFace.right_col * width),
      bottomRow: height - (clafifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onButtonClick = (event) => {
    this.setState({ imgUrl: this.state.input })
    app.models.predict("a403429f2ddf4b49b307e318f00e528b", this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signOut') {
      this.setState({ isSignedIn: false });
    }
    else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }

    this.setState({ route: route });
  }

  render() {

    const { isSignedIn, box, imageUrl, route } = this.state;

    let componentsToRender;

    switch (route) {
      case 'signIn':
      case 'signOut':
        componentsToRender = <SignIn onRouteChange={this.onRouteChange}></SignIn>
        break;

      case 'register':
        componentsToRender = <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}></Register>
        break;

      case 'home':
      default:
        componentsToRender =
          <Fragment>
            <Logo></Logo>
            <Rank></Rank>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonClick={this.onButtonClick}></ImageLinkForm>
            <FaceRecognition box={box} imgUrl={imageUrl}></FaceRecognition>
          </Fragment>
        break;
    }

    return (
      <div className="App" >
        <Particles className="particles"
          params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} loadUser={this.loadUser}></Navigation>
        {componentsToRender}
      </div>
    );
  }
}

export default App;
