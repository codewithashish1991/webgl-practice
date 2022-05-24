attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;

void main(){
  // convert pixcel to clipspace
  //(-1,+1) (+1)
  //         |
  //         |     
  // (-1)--(0,0)---- (+1)  clipspace
  //         |  
  //         |
  //(-1,-1) (-1)
  
  // Scale the position
  vec2 scaledPosition = a_position * u_scale;

  // Rotate the position
  vec2 rotatedPosition = vec2(
   scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
   scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x
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