import React, { Component } from 'react';

class AudioVisualiser extends Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.state = {
            circles: [],
            inc: 0
        }
    }
    render() {
        return <svg width={window.innerWidth} height={window.innerHeight} ref={this.canvas} style={{
            position: 'fixed',
            top: '0%',
            left: '0%',
            right: 0,
            bottom: 0,
            zIndex: '-1',
            margin: '0 auto',
            background: 'transparent'
        }}>
            {this.circles && this.circles.length > 0 ? this.circles.map(circle => circle) : null}
        </svg>;
    }
    draw() {
        let elems = [];
        elems = []
        const { audioData } = this.props;
        const canvas = this.canvas.current;
        const height = canvas.height.animVal.value;
        const width = canvas.width.animVal.value;
        const fillColor = this.props.fillColor;
        let x = 0;
        const sliceWidth = (width * 1.0) / audioData.length;
        let min = audioData.sort()[audioData.length - 1]
        let max = audioData.sort()[0]

        for (let i = 0; i < 50; i++) {
            const y = (audioData[i] / 255.0) * height;
            x += sliceWidth;
            elems.push(<circle key={i}
                className={audioData[i] === 128 ? "animation" : ""}
                r={audioData[i] !== 128 ? (x+y)-audioData[0] : 0}
                fill={fillColor ? fillColor : 'crimson'}
                cx={window.innerWidth / 2 + 10} cy={window.innerHeight / 2}
                fillOpacity={Math.random() * 0.8}
            />)

        }
        this.circles = elems

    }
    componentDidUpdate() {
        this.draw();
    }
}

export default AudioVisualiser;