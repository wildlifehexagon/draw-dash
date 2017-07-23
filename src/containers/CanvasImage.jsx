import React, { Component } from "react";
import Navigation from "./Navigation";
import { Layer, Stage, Image } from "react-konva";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { saveCanvas } from "./../actions/actions";

class CanvasImage extends React.Component {
  constructor(props) {
    super(props);
    this.props.socket.on("image_update", data => {
      var image;
      var idToUpdate = data.canvasId == 1 ? (image = document.getElementById("image1")) : (image = document.getElementById("image2"));

      image.src = data.canvasJSON;
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.canvasToSave === 1) {
      var image = document.getElementById("image1").src
      this.saveCanvasToDB(image);
    }
  }
  saveCanvasToDB(imageToSave) {
    this.props.saveCanvas({image:imageToSave,
    displayName: 'test'}
    );
  }

  render() {
    return (
      <div className="container">
        <h1>{this.props.canvasId}</h1>
        <img id={"image" + this.props.canvasId} src="http://www.bluemaize.net/im/arts-crafts-sewing/blank-canvas-3.jpg" />
      </div>
    );
  }
}

{
  /* <div id={"drawing" + this.props.canvasId} ref={ref => this.renderKonva(ref)} /> */
}

const mapStateToProps = state => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  user: state.authReducer,
  rooms: state.roomReducer.rooms,
  roomId: state.roomReducer.currentUserRoom,
  canvasToSave: state.roomReducer.canvasToSave
});

const mapDispatchToProps = dispatch => bindActionCreators({ saveCanvas }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CanvasImage);
