export default {
    name: 'banan',
    mode: WebGLRenderingContext.POINTS,
    num: 72279,
    text: `
    // tobbo

#define NUM_SEGMENTS 500.0
#define NUM_POINTS (NUM_SEGMENTS * 2.0)

vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 5.0 / 3.0, 4.0 / 3.0, 4.0);
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
  float historyV = (v * numLinesDown - 0.5) / soundRes.y;
  float snd = texture2D(sound, vec2(historyX, historyV)).a;
  float x = u * 2.0 - 1.0;
  float y = v * 2.0 - 1.0;
  vec2 xy = vec2(
      x * mix(0.5, 1.0, invV),
      y + pow(snd, 5.0) * 1.0) / (v + 0.5);
  gl_Position = vec4(xy * 0.5, 0, 1);

  float hue = u;
  float sat = invV;
  float val = invV;
  v_color = mix(vec4(hsv2rgb(vec3(hue, sat, val)), 1), background, v * v);
}`,
};