/* eslint no-console:0 consistent-return:0 */
"use strict";

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  // console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  // console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

async function main() {
  // Get A WebGL context
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // Get the strings for our GLSL shaders
  let res;
  res = await fetch('vertex.glsl');
  const vertexShaderSource = await res.text();
  res = await fetch('fragment.glsl');
  const fragmentShaderSource = await res.text();

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  // lookup uniforms

  var resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  var translationLocation = gl.getUniformLocation(program, "u_translation");
  var colorLocation = gl.getUniformLocation(program, 'u_color');

  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var translation = [0, 0];
  var width = 100;
  var height = 150;
  var thickness = 30;
  var color = [Math.random(), Math.random(), Math.random(), 1];
  drawScene();

  //setup ui

  webglLessonsUI.setupSlider("#x", {slide: updatePosition(0), max: gl.canvas.width });
  webglLessonsUI.setupSlider("#y", {slide: updatePosition(1), max: gl.canvas.height});

   function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      drawScene();
    };
  }

  function drawScene(){
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    setRectangle(gl, translation[0], translation[1], width, height, thickness);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    // set the resolution

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // set translation
    gl.uniform2fv(translationLocation, translation);
    // set color
    gl.uniform4fv(colorLocation, color);
    // draw
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 18;
    gl.drawArrays(primitiveType, offset, count);
  }
}


// function setRectangle(gl, x, y, width, height){ // for rectangle
//   const x1 = x;
//   const x2 = x + width;
//   const y1 = y;
//   const y2 = y + height;

// // | (x1,y1)     (x2,y1)
// // |
// // | (x1,y2)     (x2,y2)
// // ------------------

//   gl.bufferData(
//     gl.ARRAY_BUFFER,
//     new Float32Array([
//       x1,y1,
//       x2,y1,
//       x1,y2,
//       x1,y2,
//       x2,y1,
//       x2,y2,
//     ]),
//     gl.STATIC_DRAW
//   );
// }

function setRectangle(gl, x, y, width, height, thickness){ // for F shape
// |
// |    __________
// |   |  |_______|
// |   |  |
// |   |  |____2/3
// |   |  |____|
// |   |  |
// |   |  |
// |   ----
// | 
// ------------------

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column
      x, y,
      x+thickness, y,
      x, y + height,
      x, y + height,
      x+thickness, y,
      x+thickness, y+height,

      // top rung
      x+thickness, y,
      x+width, y,
      x+thickness, y+thickness,
      x+thickness, y+thickness,
      x+width, y,
      x + width, y + thickness,

      // middle rung
      x+thickness, y + thickness * 2,
      x + width * 2 / 3, y + thickness * 2,
      x + thickness, y + thickness * 3,
      x + thickness, y + thickness * 3,
      x + width * 2 / 3, y + thickness * 2,
      x + width * 2 / 3, y + thickness * 3,
    ]),
    gl.STATIC_DRAW
  );
}

main();