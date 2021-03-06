
  // an attribute will receive data from a buffer
  attribute vec4 a_position;
  attribute vec2 a_texCoord;
  uniform vec2 u_resolution;
  varying vec2 v_texCoord;

  // all shaders have a main function
  void main() {
    // convert the rectangle from pixels to 0.0 to 1.0
   vec2 zeroToOne = a_position / u_resolution;
   // convert from 0->1 to 0->2
   vec2 zeroToTwo = zeroToOne * 2.0;
   // convert from 0->2 to -1->+1 (clipspace)
   vec2 clipSpace = zeroToTwo - 1.0;
    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_texCoord = a_texCoord;
  }