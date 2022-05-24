attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;

void main(){
  // convert pixcel to clipspace
  //(-1,+1) (+1)
  //         |
  //         |     
  // (-1)--(0,0)---- (+1)  clipspace
  //         |  
  //         |
  //(-1,-1) (-1)

  // Add in the translation. 
  vec2 position = a_position + u_translation;
  // convert the rectangle points from pixels to 0.0 to 1.0
  vec2 zeroToOne = position/u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;
  // move -1,-1 bottom corner to top clipspace *  vec
  gl_Position = vec4(clipSpace * vec2(1,-1), 0, 1);
}