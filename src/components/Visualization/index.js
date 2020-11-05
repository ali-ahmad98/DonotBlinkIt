import React from 'react'
import AudioAnalyser from './Analyser';
import Perfect from '../../Musics/perfect.wav'
import Start from '../../Musics/start.mp3'
import Finish from '../../Musics/finish.mp3'
// import CatScreaming from '../../Musics/cat-screaming';

export default class VisualizerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audio: Start,
      audioStop: false,
    };
  }
  componentDidUpdate() {
    if (!this.state.audio.includes(this.props.audio)) {

      if (this.props.audio === 'start') {
        this.setState({ audio: Start })
      } else if (this.props.audio === 'perfect') {
        this.setState({ audio: Perfect })
      } else if (this.props.audio === 'finish') {
        this.setState({ audio: Finish })
      // } else if (this.props.audio === 'wrong') {
      //   this.setState({ audio: CatScreaming })
      }
    }
  }
  render() {
    return (<div>
      {this.props.audio.length > 0 && this.state.audio ? <iframe src={this.state.audio} allow="autoplay" style={{display: 'none'}} title={this.props.audio} onPause={() => this.setState({ audioStop: true })} ></iframe> : null}
      {this.props.audio.length !== 0 && this.state.audio && !this.state.audioStop ? <AudioAnalyser audio={this.state.audio} fillColor={this.props.fillColor} start={this.startAudio} /> : ''}
    </div>)
  }
}