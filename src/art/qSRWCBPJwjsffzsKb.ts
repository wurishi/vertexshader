export default {
    name: 'vibrations',
    mode: WebGLRenderingContext.POINTS,
    num: 25957,
    text: `
    #define PI 3.14159

float hash( float n ) { return fract(sin(n)*753.5453123); }

void main () {
  float i = hash(vertexId);
  float f = hash(i);
  float snd = texture2D(sound, vec2(f, i)).a * cos(i);
  snd = pow(snd, 2.);
  
  float ang = vertexId / 1000.;
  float perspective = .3 * (1. + mouse.y);
  float t = time * (f + .1) + mouse.x;
  float x = i * sin(ang + t) * .8;
  float y = i * cos(ang + t);
  y +=  .1 * snd * (1. - y);
  y *= perspective;
  
  float vis = snd / (y + 1.);
  
  gl_Position = vec4(x, y, 0., 1.);
  gl_PointSize = 10. * vis;
  
  v_color = vec4(
    snd * .7 * (1. - f),
    snd * .8 * cos(f * PI),
    snd * 2.,
    vis);
}`,
};