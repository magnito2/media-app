import React, { Component } from "react";
import { Resizable, ResizableBox } from 'react-resizable';
import '../../styles/react-resizable.css';

import {connect} from 'react-redux';
import {mediaSoupActions, websocketActions} from "../../actions";
import { Container, Button } from '@material-ui/core';


class ClassRoom extends Component{

    constructor(props){
        super(props);
        this.state = {
            width : 600,
            height : 400,
            localStream : null,
            remoteStream : null
        };
        this.socket = null;

    }

    componentDidMount() {
        this.props.connectWebSocket();

    }
    onResize = (event, {element, size, handle}) => {
        this.setState({width: size.width, height: size.height});
    };

    onClick = (event) => { this.props.disconnectWebSocket()};

    render(){
        return (
            <div id="content">
                <button onClick={this.onClick} style={{'marginBottom': '10px'}}>Reset first element's width/height</button>
                <div className="layoutRoot">
                    <Resizable className="box" height={this.state.height} width={this.state.width} onResize={this.onResize} resizeHandles={['se', 'nw']}>
                        <div>
                            <video id="remoteVideo" src={this.state.remoteStream} controls autoPlay playsInline/>
                        </div>
                    </Resizable>
                    <ResizableBox className="box" width={200} height={200}>
                        <video id="localVideo" src={this.state.localStream} controls autoPlay playsInline/>
                    </ResizableBox>
                </div>
                <Container maxWidth="sm">
                    <Button variant="contained" color="primary" onClick = {() => {this.props.startProducer()}}>
                        Start Sending Video
                    </Button>
                    <Button variant="contained" color="secondary" onClick ={() => {this.props.startConsumer()}}>
                        Start Receiving Video
                    </Button>
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        ws_state : state.websocket
    }
}

function mapDispatchToProps(dispatch){
    return {
        connectWebSocket : () => dispatch(websocketActions.connect()),
        disconnectWebSocket : () => dispatch(websocketActions.disconnect()),
        startProducer : () => dispatch(mediaSoupActions.createTransport("PRODUCER")),
        startConsumer : () => dispatch(mediaSoupActions.createTransport("CONSUMER"))
    }
}

const connectedClassRoom = connect(mapStateToProps, mapDispatchToProps)(ClassRoom);

export default connectedClassRoom;
