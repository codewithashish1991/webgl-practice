// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

uniform sampler2D u_image;
varying vec2 v_texCoord;

void main() {
  // gl_FragColor is a special variable a fragment shader
  // is responsible for setting
  // gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
  gl_FragColor = texture2D(u_image, v_texCoord);

}