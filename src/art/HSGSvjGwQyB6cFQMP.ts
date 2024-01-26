export default {
    name: 'dots',
    mode: WebGLRenderingContext.POINTS,
    num: 5000,
    bg: 0xffffff,
    text: `
    #define NUM_SEGMENTS 64.0
#define NUM_POINTS (NUM_SEGMENTS * 2.0)
#define STEP 1.0
#define NUM_LINES_DOWN 32.0
#define PI 3.14159

vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  // produces 0,1, 1,2, 2,3, ...
  float point = floor(mod(vertexId, NUM_POINTS) / 2.0) + mod(vertexId, 2.0) * STEP;
  // line count
  float count = floor(vertexId / NUM_POINTS);

  float u = point / NUM_SEGMENTS;    // 0 <-> 1 across line
  float v = count / NUM_LINES_DOWN;  // 0 <-> 1 by line
  float invV = 1.0 - v;

  // Only use the left most 1/4th of the sound texture
  // because there's no action on the right
  float historyX = u * 0.25;
  // Match each line to a specific row in the sound texture
  float historyV = (v * NUM_LINES_DOWN + 0.5) / soundRes.y;
  float snd = texture2D(sound, vec2(historyX, historyV)).a;
  float sndPM = snd * 2.0 - 1.0;
  
  gl_PointSize = min(32.0, snd * 32.0) * invV;

  float x = u * 2.0 - 1.0 + sndPM * 0.05;
  float y = v * 2.0 - 1.0;;
  vec2 xy = vec2(x, y);
  gl_Position = vec4(xy, 0, 1);

  float hue = u * 0.1 + time * 0.01;
  float sat = invV;
  float val = mix(snd * invV, 1.0, v);
  v_color = vec4(hsv2rgb(vec3(hue, sat, val)), 1);
}`,
};
