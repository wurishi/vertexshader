export default {
    name: 'mouse-wip',
    mode: WebGLRenderingContext.LINES,
    num: 57600,
    text: `
    // ==========================================
//  ^
//  |
//  +-- click "hide" then MOVE YOUR MOUSE!!!!
// ==========================================

#define PI 3.14159

vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  float u = 0.0;
  float v = fract(vertexId / 240.0);
  float age = floor(vertexId / 240.0) / 240.0;
  float invAge = 1.0 - age;
  vec4 touch = texture2D(touch, vec2(u, v));
  float snd = texture2D(sound, vec2(v, age) * vec2(0.25, 0.25)).a;
  float t = time - touch.w;
  
  float a = mod(vertexId, 6.0) / 6.0 * PI * 2.0 + t * 100.0;
  vec2 cs = vec2(cos(a), sin(a));
  vec2 xy = vec2(touch.xy) +  (cs * age * snd * 0.2 - 0.1) * 0.1;
  gl_Position = vec4(xy * (1.0 + (age + t) * 1.0) , age, 1);

  float hue = mix(age + 0.6 + sin(v * PI * 2.0) * 0.9, 0.0, touch.z);
  vec3 color = hsv2rgb(vec3(hue, invAge, snd + touch.z));
  v_color = vec4(mix(color, background.rgb, age) * invAge, invAge);
  gl_PointSize = mix(20.0, 1.0, age);

}

`,
};