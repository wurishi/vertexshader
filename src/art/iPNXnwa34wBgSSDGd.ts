export default {
    name: 'crystal irisz (mouse.xy)',
    mode: WebGLRenderingContext.TRIANGLES,
    num: 79552,
    text: `
#define PI radians(180.)

vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

mat4 rotY( float angle ) {
    float s = sin( angle );
    float c = cos( angle );
  	
    return mat4( 
      c, 0,-s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1);  
}


mat4 rotZ( float angle ) {
    float s = sin( angle );
    float c = cos( angle );
  	
    return mat4( 
      c,-s, 0, 0, 
      s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1); 
}

mat4 trans(vec3 trans) {
  return mat4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    -1, 0, 1, 0,
    trans, 1);
}

mat4 ident() {
  return mat4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, -0.9,
    0, 0, 0, 1);
}

mat4 scale(vec3 s) {
  return mat4(
    s[0], 0, 0, 0,
    0, s[1], 0, 0,
    0, 0, s[2], 0,
    0, 0, 0, 1);
}

mat4 uniformScale(float s) {
  return mat4(
    s, 0, 0, 0,
    0, s, 0, 0,
    0, 0, s, 0,
    0, 0, 0, 1);
}

// hash function from https://www.shadertoy.com/view/4djSRW
float hash(float p) {
	vec2 p2 = fract(vec2(p * 5.3983, p * 15.4427));
    p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
	return fract(p2.x * p2.y * 95.4337);
}

float m1p1(float v) {
  return v * 2. - 1.;
}

float p1m1(float v) {
  return v * 0.5 + 1.1;
}

float inv(float v) {
  return 1. - v;
}

#define NUM_EDGE_POINTS_PER_CIRCLE 48.
#define NUM_SUBDIVISIONS_PER_CIRCLE 16.
#define NUM_POINTS_PER_DIVISION (NUM_EDGE_POINTS_PER_CIRCLE * 6.)
#define NUM_POINTS_PER_CIRCLE (NUM_SUBDIVISIONS_PER_CIRCLE * NUM_POINTS_PER_DIVISION) 
void getCirclePoint(const float id, const float inner, const float start, const float end, out vec3 pos, out vec2 uv) {
  float edgeId = mod(id, NUM_POINTS_PER_DIVISION);
  float ux = floor(edgeId / 6.) + mod(edgeId, 2.);
  float vy = mod(floor(id / 2.) + floor(id / 3.), 2.); // change that 3. for cool fx
  float sub = floor(id / NUM_POINTS_PER_DIVISION);
  float subV = sub / (NUM_SUBDIVISIONS_PER_CIRCLE - 1.);
  float level = subV + vy / (NUM_SUBDIVISIONS_PER_CIRCLE - 2.4);
  float u = ux / NUM_EDGE_POINTS_PER_CIRCLE;
  float v = mix(inner, 1., level);
  float a = mix(start, end, u) * PI * 2. + PI * 2.0;
  float s = sin(a);
  float c = cos(a);
  float x = c * v;
  float y = s * v;
  float z = 0.5;
  pos = vec3(x, y, z);  
  uv  = vec2(u, level);
}

float goop(float t) {
  return sin(t) + sin(t * 3.27) + sin(t * 0.13 - mouse.y) + sin(t * 3.73);
}

void main() {
  float circleId = floor(vertexId / NUM_POINTS_PER_CIRCLE);
  float pointId = mod(vertexId, NUM_POINTS_PER_CIRCLE);
//  float sideId = floor(circleId / 2.);
//  float side = mix(-1., 1., step(0.5, mod(circleId, 2.)));
  float numCircles = floor(vertexCount / NUM_POINTS_PER_CIRCLE);
  float cu = circleId / numCircles;
  vec3 pos;
  float inner = mix(0.3, 0., p1m1(sin(goop(circleId) + time * 3.1)));
  float start = fract(hash(circleId * 0.33) + sin(time * 0.83 + circleId) * 1.1 *mouse.x);
  float end   = start + 1.;//start + hash(sideId + 1.);
  vec2 uv;
  getCirclePoint(pointId, inner, start, end, pos, uv); 
  
  float snd = texture2D(sound, vec2((cu + abs(uv.x * 1.8 - 2.)) * 0.05, uv.y * 1.4)).a;
  
  vec3 offset = vec3(m1p1(hash(circleId)) * 0.5, m1p1(hash(circleId * 0.37)), -m1p1(circleId / numCircles));
  offset.x += goop(circleId + time * 0.103) * 0.4;
  offset.y += goop(circleId + time * 0.13) * 0.31;
  vec3 aspect = vec3(1, resolution.x / resolution.y, 1);
  
  mat4 mat = ident(); 
  mat *= scale(aspect);
  mat *= trans(offset);
  mat *= uniformScale(mix(0.1, 1.8, hash(circleId)));
  gl_Position = vec4((mat * vec4(pos, 1)).xyz, 1.3 -mouse.y );
  gl_PointSize = 4.;

  float hue = mix(0.1 -snd , 0.9 *mouse.x, fract(circleId * 1.79 * snd));
  float sat = 0.5;
  float val = 1.0 * snd ;
  v_color = vec4(hsv2rgb(vec3(hue, sat, val)), (1. - uv.y) * pow(snd + 0.21, snd*6.));
  v_color = vec4(v_color.rgb * v_color.a, v_color.a);
}`,
};