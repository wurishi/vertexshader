export default {
    name: 'candy',
    mode: WebGLRenderingContext.TRIANGLES,
    num: 40417,
    bg: 0xffffff,
    text: `
#define PI radians(180.0)

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
    0, 0, 1, 0,
    trans, 1);
}

mat4 ident() {
  return mat4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
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
	vec2 p2 = fract(vec2(p * 5.3983, p * 5.4427));
    p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
	return fract(p2.x * p2.y * 95.4337);
}

float m1p1(float v) {
  return v * 2. - 1.;
}

float p1m1(float v) {
  return v * 0.5 + 0.5;
}

float inv(float v) {
  return 1. - v;
}

#define NUM_EDGE_POINTS_PER_CIRCLE 48.
#define NUM_POINTS_PER_CIRCLE (NUM_EDGE_POINTS_PER_CIRCLE * 6.) 
#define NUM_CIRCLES_PER_GROUP 1.
void getCirclePoint(const float id, const float inner, const float start, const float end, out vec3 pos) {
  float outId = id - floor(id / 3.) * 2. - 1.;   // 0 1 2 3 4 5 6 7 8 .. 0 1 2, 1 2 3, 2 3 4
  float ux = floor(id / 6.) + mod(id, 2.);
  float vy = mod(floor(id / 2.) + floor(id / 3.), 2.); // change that 3. for cool fx
  float u = ux / NUM_EDGE_POINTS_PER_CIRCLE;
  float v = mix(inner, 1., vy);
  float a = mix(start, end, u) * PI * 2. + PI * 0.0;
  float s = sin(a);
  float c = cos(a);
  float x = c * v;
  float y = s * v;
  float z = 0.;
  pos = vec3(x, y, z);  
}

float goop(float t) {
  return sin(t) + sin(t * 0.27) + sin(t * 0.13) + sin(t * 0.73);
}

float easeInOutSine(float t) {
  return (-0.5 * (cos(PI * t) - 1.));
}

float mixer(float t, float timeOff, float duration) {
  t = mod(t, duration * 2.0);
  t = t - timeOff;
  if (t > duration) {
    t = duration + 1. - t;
  }
  return easeInOutSine(clamp(t, 0., 1.));
}

void main() {
  float circleId = floor(vertexId / NUM_POINTS_PER_CIRCLE);
  float groupId = floor(circleId / NUM_CIRCLES_PER_GROUP);
  float pointId = mod(vertexId, NUM_POINTS_PER_CIRCLE);
  float sliceId = mod(floor(vertexId / 6.), 2.);
  float side = mix(-1., 1., step(0.5, mod(circleId, 2.)));
  float numCircles = floor(vertexCount / NUM_POINTS_PER_CIRCLE);
  float numGroups = floor(numCircles / NUM_CIRCLES_PER_GROUP); 
  float cu = circleId / numCircles;
  float gv = groupId / numGroups;
  float cgId = mod(circleId, NUM_CIRCLES_PER_GROUP);
  float cgv = cgId / NUM_CIRCLES_PER_GROUP;
  float ncgv = 1. - cgv;
  
  
  float tm = time - cgv * 0.2;
  float su = hash(groupId);
  float snd = texture2D(sound, vec2(mix(0.001, 0.024, cu), gv * 1.)).a;
  snd = pow(snd, mix(2., 0.5, su));
  
  
  vec3 pos;
  float inner = mix(0.0, 0.98, cgv);
  float start = 0.;//fract(hash(sideId * 0.33) + sin(time * 0.1 + sideId) * 1.1);
  float end   = 1.; //start + hash(sideId + 1.);
  getCirclePoint(pointId, inner, start, end, pos); 
  pos.z = cgv;
  
//  float historyX = mix(0.01, 0.14, u);
//  snd = pow(snd, mix(2., 0.5, u));
  
  

  // ----
  vec3 offset = vec3(0, 0, gv);
  
//  vec3 offset = vec3(hash(groupId) * 0.8, m1p1(hash(groupId * 0.37)), cgv);
//  offset.x += m1p1(pow(snd, 5.0) + goop(groupId + time * 0.) * 0.1);
//  offset.y += goop(groupId + time * 0.) * 0.1;
  vec3 aspect = vec3(1, resolution.x / resolution.y, 1);
  
  mat4 mat = ident(); 
  mat *= scale(aspect);
  mat *= rotZ(time * 1.3 + time * -0.01 * (1. + (1. - gv) * 200.5));
  mat *= trans(offset);
  mat *= uniformScale(pow(gv * 2.8 + sliceId * gv * 0.5, 2.));
//  mat *= uniformScale( pow(snd + 0.1, 5.0) * 0.1 + sliceId * 0.1);
  gl_Position = vec4((mat * vec4(pos, 1)).xyz, 1);
  gl_PointSize = 4.;

  float hue = time * -0.01 + mix(0., .2, gv);
  float sat = 0.6 - pow(snd, 5.) * 0.6;
  float val = 1.;//ncgv;//1.;//mix(0.0, 0.0, fract(circleId * 0.79)) + sliceId * .65;
  v_color = vec4(hsv2rgb(vec3(hue, sat, val)), 1);
  v_color.rgb *= v_color.a;
}`,
};