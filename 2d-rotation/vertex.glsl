attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;

void main(){
  // convert pixcel to clipspace
  //(-1,+1) (+1)
  //         |
  //         |     
  // (-1)--(0,0)---- (+1)  clipspace
  //         |  
  //         |
  //(-1,-1) (-1)

  // Rotate the position
  vec2 rotatedPosition = vec2(
   a_position.x * u_rotation.y + a_position.y * u_rotation.x,
   a_position.y * u_rotation.y - a_position.x * u_rotation.x
  );

  // Add in the translation. 
  vec2 position = rotatedPosition + u_translation;
  // convert the rectangle points from pixels to 0.0 to 1.0
  vec2 zeroToOne = position/u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;
  // move -1,-1 bottom corner to top clipspace *  vec
  gl_Position = vec4(clipSpace * vec2(1,-1), 0, 1);
}