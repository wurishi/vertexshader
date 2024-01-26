export default {
    name: 'Pulsing dots',
    mode: WebGLRenderingContext.POINTS,
    num: 20873,
    text: `
    //Music visualizer by Nick Powers

vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  
  vec2 segments = resolution / 45.0;
  vec2 coord = vec2(mod(vertexId, segments.x), vertexId / segments.x);
  coord -= segments * 0.5;
  coord /= segments / 2.0;
  

  float aspect = resolution.x / resolution.y;
  gl_Position = vec4(coord.x, coord.y, 0, 1);
  
  coord.x *= aspect;
  
  float d = length(coord);
  float hue = mod(d + (time * 0.0), 1.0);
  hue -= mod(hue, 0.15);
  float snd = texture2D(sound, vec2(0.5 - hue, 0.0)).a;
  gl_PointSize = snd * 50.0 * (0.5 + 0.5 * sin(time * d * 5.0));
  v_color = vec4(hsv2rgb(vec3(hue, 1, 1)), 1);
}`,
};