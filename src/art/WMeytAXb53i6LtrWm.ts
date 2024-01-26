export default {
    name: 'woozy',
    mode: WebGLRenderingContext.LINES,
    num: 6000,
    text: `
    /*

                     
___  _____________   
\  \/ /  ___/\__  \  
 \   /\___ \  / __ \_
  \_//____  >(____  /
          \/      \/ 































































*/

#define PI radians(180.0)

void main() {
  float pointsPerLine = 30.;
  float lineId = floor(vertexId / pointsPerLine);
  float numLines = floor(vertexCount / pointsPerLine);

  float lineV = lineId / numLines;
  float angle = lineV * PI * 2.;
  
  float pointId = mod(vertexId, pointsPerLine);
  float pointV = pointId / (pointsPerLine - 1.);
  
  float id = floor(pointId / 2.) + mod(pointId, 2.);
  float idV = id / (pointsPerLine / 2. - 1.);
  
  float snd = texture2D(sound, vec2(abs(lineV - 0.5) * 0.15, pointV * 0.5)).a;
  
  float odd = mod(id, 2.);
  angle += sin(time + idV * 21.) * odd * 0.2 + time * 0.1 + snd * 0.;
//  angle += odd * 0.2;
  
//  float radius = pow(idV + 1., 2.) - 3.0;
  float radius = pow(idV, 2.) + sin(time + lineV * PI * 2. * 8.) * odd * idV * 0.1;
  float c = cos(angle) * radius;
  float s = sin(angle) * radius;

  vec2 aspect = vec2(1, resolution.x / resolution.y) * 1.1;
  vec2 xy = vec2(c, s);
  gl_Position = vec4(xy * aspect, 0, 1);

  float p = 1. - pow(snd, 5.);
  float pump = step(0.9, snd);
  v_color = vec4(0, p, p, idV) + pump * vec4(0,10,10,0);
  v_color.rgb *= v_color.a;
}`,
};