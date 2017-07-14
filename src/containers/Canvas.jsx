import React, { Component } from "react";
import Navigation from './Navigation';
import {Layer, Stage, Image} from 'react-konva';

class Canvas extends React.Component {
  renderKonva(container) {
    var width = window.innerWidth;
    var height = window.innerHeight - 25;
    // first we need Konva core things: stage and layer
    var stage = new Konva.Stage({
      container: 'drawing',
      width: width,
      height: height
    });
    var layer = new Konva.Layer();
    stage.add(layer);
    // then we are going to draw into special canvas element
    var canvas = document.createElement('canvas');
    canvas.width = stage.width() / 2;
    canvas.height = stage.height() / 2;
    // creted canvas we can add to layer as "Konva.Image" element
    var image = new Konva.Image({
        image: canvas,
        x : stage.width() / 4,
        y : stage.height() / 4,
        stroke: 'green',
        shadowBlur: 5
    });
    layer.add(image);
    stage.draw();
    // Good. Now we need to get access to context element
    var context = canvas.getContext('2d');
    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;
    var isPaint = false;
    var lastPointerPosition;
    var mode = 'brush';
    // now we need to bind some events
    // we need to start drawing on mousedown
    // and stop drawing on mouseup
    stage.on('contentMousedown.proto', function() {
      isPaint = true;
      lastPointerPosition = stage.getPointerPosition();
    });
    stage.on('contentMouseup.proto', function() {
        isPaint = false;
    });
    // and core function - drawing
    stage.on('contentMousemove.proto', function() {
      if (!isPaint) {
        return;
      }
      if (mode === 'brush') {
        context.globalCompositeOperation = 'source-over';
      }
      if (mode === 'eraser') {
        context.globalCompositeOperation = 'destination-out';
      }
      context.beginPath();
      var localPos = {
        x: lastPointerPosition.x - image.x(),
        y: lastPointerPosition.y - image.y()
      };
      context.moveTo(localPos.x, localPos.y);
      var pos = stage.getPointerPosition();
      localPos = {
        x: pos.x - image.x(),
        y: pos.y - image.y()
      };
      context.lineTo(localPos.x, localPos.y);
      context.closePath();
      context.stroke();
      lastPointerPosition = pos;
      layer.draw();
    });
    var select = document.getElementById('tool');
    select.addEventListener('change', function() {
      mode = select.value;
    });
  }

    render () {
      return (
        <div className="container">
          <Navigation />
          <h2>Canvas Component</h2>
          <div id="drawing" ref={ref => this.renderKonva(ref)}>
          </div>
        </div>
      );
    }

  }

export default Canvas;
