export default {
    name: 'use-thi-mic',
    mode: WebGLRenderingContext.LINES,
    num: 100000,
    bg: 0xffffff,
    text: `
    #define NUM_SEGMENTS 128.0
#define NUM_POINTS (NUM_SEGMENTS * 2.0)
#define PI radians(180.)

vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  float numLinesDown = floor(vertexCount / NUM_POINTS);
  // produces 0,1, 1,2, 2,3, ...
  float point = floor(mod(vertexId, NUM_POINTS) / 2.0) + mod(vertexId, 2.0);
  // line count
  float count = floor(vertexId / NUM_POINTS);

  float u = point / NUM_SEGMENTS;  // 0 <-> 1 across line
  float v = count / numLinesDown;  // 0 <-> 1 by line
  float invV = 1.0 - v;

  // Only use the left most 1/4th of the sound texture
  // because there's no action on the right
  float historyX = u * 0.25;
  // Match each line to a specific row in the sound texture
  float historyV = (v * numLinesDown + 0.5) / soundRes.y;
  float snd = texture2D(sound, vec2(historyX, historyV * 0.5)).a;

  float x = u * 2.0 - 1.0;
  float y = invV;// * 2.0 - 1.0;
  vec2 xy = vec2(
      x * mix(0.5, 1.0, invV),
      y + pow(snd, 1.0) * 1.0) ;
  float a = (u * 2. - 1.) * PI + time * 0.1;// * invV * PI;//u * PI * .2 + time * 0. + v * 0. + snd;
  float c = cos(a);
  float s = sin(a);
  mat2 mat = mat2(c, s, -s, c);
  gl_Position = vec4(mat * (xy * 0.5), v, 1);

  float s2 = 1. - pow(1. - snd, 5.);
  float hue = sin(u * PI * 2.) * .0 + time * 0.;
  float sat = s2;
  float val = s2;
  v_color = mix(vec4(hsv2rgb(vec3(hue, sat, val)), 1), background, 0.);
  v_color.a = s2;
  v_color.rgb *= v_color.a;
}`,
};