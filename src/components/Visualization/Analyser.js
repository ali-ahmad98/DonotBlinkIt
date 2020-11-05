import React, { Component } from 'react';
import AudioVisualiser from './AudioVisualizer';

class AudioAnalyser extends Component {
    constructor(props) {
        super(props);
        this.state = { audioData: new Uint8Array(0) };
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        const audio = new Audio(this.props.audio);
        audio.autoplay = true;
        this.audioContext = new(window.AudioContext ||
            window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.source = this.audioContext.createMediaElementSource(audio);
        this.source.connect(this.analyser);
        this.rafId = requestAnimationFrame(this.tick);

        audio.play()
    }
    tick() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.setState({ audioData: this.dataArray });
        this.rafId = requestAnimationFrame(this.tick);
    }
    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.source.disconnect();
    }

    render() {
        return <AudioVisualiser fillColor = { this.props.fillColor }
        audioData = { this.state.audioData }
        />
    }
}

export default AudioAnalyser;