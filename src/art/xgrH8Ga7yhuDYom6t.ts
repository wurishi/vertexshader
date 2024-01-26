export default {
    name: 'flowerworm',
    mode: WebGLRenderingContext.LINE_STRIP,
    num: 54268,
    text: `
    // johan

#define PI radians(180.)

void main() {
  
  float aspect = resolution.x / resolution.y;

  float cPoints = 64.;
  float circles = ceil(vertexCount / cPoints);
  float cId = floor(vertexId / cPoints);
  float cNorm = cId / circles;
  float vId = mod(vertexId, cPoints);
  

  float a = 2. * PI * vId / (cPoints - 1.);

  float snd = pow(texture2D(sound, vec2(0.05, cNorm * .125)).a, 4.);
  
  float rad = 0.05 + 0.1 * (1. - cNorm) + sin(a * 10.) * (0.05 + 0.3 * snd);
  float x = sin(a) * rad;
  float y = cos(a) * rad;
  
  
  x += sin(time * 1.23 + cId / 133.3) * .3;
  y += cos(time * 1.09 - cId / 159.2) * .3 / aspect;
  
  x += sin(time * 1.31 + cId / 171.3) * .4;
  y += cos(time * 1.49 - cId / 147.2) * .4 / aspect;
  

  gl_Position = vec4(x, y * aspect, 0, 1);
  
  float r = sin(time * 1.42 - cNorm * 8.) * .5 + .5;
  float g = sin(time * 1.27 + a) * .5 + .5;
  float b =  sin(time * 1.12 + cNorm * 6.) * .5 + .5;

  v_color = vec4(r, g, b, 1);
}`,
};