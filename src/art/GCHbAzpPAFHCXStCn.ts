export default {
    name: 'blendy',
    mode: WebGLRenderingContext.POINTS,
    num: 8542,
    text: `
    #define PI 3.14159
#define NUM_SEGMENTS 21.0
#define NUM_POINTS (NUM_SEGMENTS * 2.0)
#define STEP 5.0
//#define FIT_VERTICAL

vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  gl_PointSize = 40.0;
  float localTime = time + 20.0;
  float point = mod(floor(vertexId / 2.0) + mod(vertexId, 2.0) * STEP, NUM_SEGMENTS);
  float count = floor(vertexId / NUM_POINTS);
  float offset = count * 0.04;
  float angle = point * PI * 2.0 / NUM_SEGMENTS + offset;
  float radius = 0.2;
  float c = cos(angle + localTime) * radius;
  float s = sin(angle + localTime) * radius;
  float orbitAngle = count * 0.01;
  float r2 = sin(orbitAngle);
  float oC = cos(orbitAngle + localTime * count * 0.01) * r2;
  float oS = sin(orbitAngle + localTime * count * 0.01) * r2;

  #ifdef FIT_VERTICAL
    vec2 aspect = vec2(resolution.y / resolution.x, 1);
  #else
    vec2 aspect = vec2(1, resolution.x / resolution.y);
  #endif

  vec2 xy = vec2(
      oC + c,
      oS + s);

  float dd = length(xy);
  float snd = pow(texture2D(sound, vec2(fract(count * 0.01) * 0.25, dd * 0.1)).a, 5.0);
 
  xy = xy + xy * snd ;
  gl_Position = vec4(xy * aspect + mouse * 0.1, -fract(count * 10.01), 1);
  
  float hue = (localTime * 0.01 + count * 1.001);
  v_color = vec4(mix(hsv2rgb(vec3(hue + snd, 1, 1)), vec3(1,1,1), snd), 0.1 + snd * 0.5);
  v_color = vec4(v_color.rgb * v_color.a, v_color.a);
}`,
};