import ImageLinkForm from './components/image-link-form/ImageLinkForm';
import React, { Component } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/face-recognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

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
      box: {}
    }
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

  render() {
    return (
      <div className="App" >
        <Particles className="particles"
          params={particlesOptions} />
        <Navigation></Navigation>
        <Rank></Rank>
        <Logo></Logo>
        <ImageLinkForm onInputChange={this.onInputChange} onButtonClick={this.onButtonClick}></ImageLinkForm>
        <FaceRecognition box={this.state.box} imgUrl={this.state.imgUrl}></FaceRecognition>
      </div>
    );
  }
}

export default App;
