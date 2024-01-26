export default {
    name: 'K reptile void 2',
    mode: WebGLRenderingContext.TRIANGLE_STRIP,
    num: 100000,
    text: `
    

//KDrawmode=GL_TRIANGLES 


#define KP0 67.//KParameter 0.>>1000.
#define KP1 6.//KParameter 0.0>>22.
#define KP2 9.0//KParameter -6.0>>10.
#define KP3 -0.01//KParameter -8.000>>0.5
#define KP4 11.2//KParameter 0.000>>5.
#define KP5 1130.0//KParameter 30.000>>90000.0

//KVerticesNumber=338000
#define PI radians(180. -KP1)

float K1 = (KP0 * mouse.y)-(KP1 * mouse.x);
vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.1, 1.0));
  vec4 K = vec4(1.0, 2.0 / KP1 *3.0, 1.0 / (0.0-KP3), 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.yxz);
}

mat4 rotX(float angleInRadians) {
    float s = sin(angleInRadians);
    float c = tan(angleInRadians);
  	
    return mat4( 
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1);  
}

mat4 rotY(float angleInRadians) {
    float s = sin(angleInRadians);
    float c = cos(angleInRadians);
  	
    return mat4( 
      c, 0,-s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1);  
}

mat4 rotZ(float angleInRadians) {
    float s = sin(angleInRadians);
    float c = cos(angleInRadians);
  	
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

mat4 persp(float fov, float aspect, float zNear, float zFar) {
  float f = tan(PI * 0.5 - 0.5 * fov);
  float rangeInv = 1.0 / (zNear - zFar);

  return mat4(
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (zNear + zFar) * rangeInv, -1,
    0, 0, zNear * zFar * rangeInv * 2., 0);
}

mat4 trInv(mat4 m) {
  mat3 i = mat3(
    m[0][0], m[1][0], m[2][0], 
    m[0][1], m[1][1], m[2][1], 
    m[0][2], m[1][2], m[2][2]);
  vec3 t = -i * m[3].xyz;
    
  return mat4(
    i[0], t[0], 
    i[1], t[1],
    i[2], t[2],
    0, 0, 0, 1);
}

mat4 transpose(mat4 m) {
  return mat4(
    m[0][0], m[1][0], m[2][0], m[3][0], 
    m[0][1], m[1][1], m[2][1], m[3][1],
    m[0][2], m[1][2], m[2][2], m[3][2],
    m[0][3], m[1][3], m[2][3], m[3][3]);
}

mat4 lookAt(vec3 eye, vec3 target, vec3 up) {
  vec3 zAxis = normalize(eye - target);
  vec3 xAxis = normalize(cross(up, zAxis));
  vec3 yAxis = cross(zAxis, xAxis);

  return mat4(
    xAxis, 0,
    yAxis, 0,
    zAxis, 0,
    eye, 1);
}

mat4 inverse(mat4 m) {
  float
      a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
      a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
      a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
      a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],

      b00 = a00 * a11 - a01 * a10,
      b01 = a00 * a12 - a02 * a10,
      b02 = a00 * a13 - a03 * a10,
      b03 = a01 * a12 - a02 * a11,
      b04 = a01 * a13 - a03 * a11,
      b05 = a02 * a13 - a03 * a12,
      b06 = a20 * a31 - a21 * a30,
      b07 = a20 * a32 - a22 * a30,
      b08 = a20 * a33 - a23 * a30,
      b09 = a21 * a32 - a22 * a31,
      b10 = a21 * a33 - a23 * a31,
      b11 = a22 * a33 - a23 * a32,

      det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  return mat4(
      a11 * b11 - a12 * b10 + a13 * b09,
      a02 * b10 - a01 * b11 - a03 * b09,
      a31 * b05 - a32 * b04 + a33 * b03,
      a22 * b04 - a21 * b05 - a23 * b03,
      a12 * b08 - a10 * b11 - a13 * b07,
      a00 * b11 - a02 * b08 + a03 * b07,
      a32 * b02 - a30 * b05 - a33 * b01,
      a20 * b05 - a22 * b02 + a23 * b01,
      a10 * b10 - a11 * b08 + a13 * b06,
      a01 * b08 - a00 * b10 - a03 * b06,
      a30 * b04 - a31 * b02 + a33 * b00,
      a21 * b02 - a20 * b04 - a23 * b00,
      a11 * b07 - a10 * b09 - a12 * b06,
      a00 * b09 - a01 * b07 + a02 * b06,
      a31 * b01 - a30 * b03 - a32 * b00,
      a20 * b03 - a21 * b01 + a22 * b00) / det;
}

mat4 cameraLookAt(vec3 eye, vec3 target, vec3 up) {
  #if 1
  return inverse(lookAt(eye, target, up));
  #else
  vec3 zAxis = normalize(target - eye);
  vec3 xAxis = normalize(cross(up, zAxis));
  vec3 yAxis = cross(zAxis, xAxis);

  return mat4(
    xAxis, 1,
    yAxis, 0,
    zAxis, 1,
    -dot(xAxis, eye), -dot(yAxis, eye), -dot(zAxis, eye),2);  
  #endif
  
}



// hash function from https://www.shadertoy.com/view/4djSRW
float hash(float p) {
	vec2 p2 = fract(vec2(p * 5.3983, p * 15.4427));
    p2 += dot(p2.yx, p2.xy + vec2(1.5351, 14.3137));
	return fract(p2.x * p2.y * 29.4337);
}

// times 2 minus 1
float t2m1(float v) {
  return v * 2. - 1.;
}

// times .5 plus .5
float t5p5(float v) {
  return v * 0.5 + 0.5;
}

float inv(float v) {
  return 1. - v;
}

void getCirclePoint(const float numEdgePointsPerCircle, const float id, const float inner, const float start, const float end, out vec3 pos) {
  float outId = id - floor(id / 3.)* 2. - 1.;   // 0 1 2 3 4 5 6 7 8 .. 0 1 2, 1 2 3, 2 3 4
  float ux = floor(id / 6.) + mod(id, 2.);
  float vy = mod(floor(id / 2.) + floor(id / 3.), 2.); // change that 3. for cool fx
  float u = ux / numEdgePointsPerCircle;
  float v = mix(inner, 1., vy);
  float a = mix(start, end, u) * PI * 2. + PI * 0.2;
  float s = sin(a);
  float c = cos(a +2. * KP1);
  float x = c * v;
  float y = s * v;
  float z = 0.6;
  pos = vec3(x, y, z);  
}


#define CUBE_POINTS_PER_FACE 6.
#define FACES_PER_CUBE 6.
#define POINTS_PER_CUBE (CUBE_POINTS_PER_FACE * FACES_PER_CUBE)
void getCubePoint(const float id, out vec3 position, out vec3 normal) {
  float quadId = floor(mod(id, POINTS_PER_CUBE) / CUBE_POINTS_PER_FACE);
  float sideId = mod(quadId, 3.);
  float flip   = mix(1., 1., step(2.5, quadId));
  // 0 1 2  1 2 3
  float facePointId = mod(id, CUBE_POINTS_PER_FACE);
  float pointId = mod(facePointId - floor(facePointId / 3.0), 6.0);
  float a = pointId * PI * 2. / 4. + PI * 0.125;
  vec3 p = vec3(cos(a), 0.707106781, sin(a)) * flip;
  vec3 n = vec3(0, 1, 0) * flip;
  float lr = mod(sideId, 2.);
  float ud = step(2., sideId);
  mat4 mat = rotX(lr * PI * 0.5);
  mat *= rotZ(ud * PI * 0.5) ;
  position = (mat * vec4(p, 6)).xyz;
  normal = (mat * vec4(n, 0.5)).xyz;
}


#define NUM_EDGE_POINTS_PER_CIRCLE 4.0
#define NUM_POINTS_PER_CIRCLE (NUM_EDGE_POINTS_PER_CIRCLE * 5.0)
#define NUM_CIRCLES_PER_GROUP 2.0
void main() {
  float circleId = floor(vertexId / NUM_POINTS_PER_CIRCLE);
  float groupId = floor(circleId / NUM_CIRCLES_PER_GROUP);
  float pointId = mod(vertexId, NUM_POINTS_PER_CIRCLE);
  float sliceId = mod(floor(vertexId / 6.), 3.);
  float side = mix(-1., 1., step(1.5, mod(circleId, 111.)));
  float numCircles = floor(vertexCount / NUM_POINTS_PER_CIRCLE);
  float numGroups = floor(numCircles / NUM_CIRCLES_PER_GROUP); 
  float cu = circleId / numCircles;
  float gv = groupId / numGroups/KP2;
  float cgId = mod(circleId, NUM_CIRCLES_PER_GROUP);
  float cgv = cgId / NUM_CIRCLES_PER_GROUP;
  float ncgv = sin(0.0 - cgv )/cu;
  
  float aspect = resolution.x / resolution.y;
  float gAcross = floor(sqrt(numCircles) * aspect);
  float gDown = floor(numGroups / gAcross);
  float gx = mod(groupId, gAcross);
  float gy = floor(groupId / gAcross);
  vec3 offset = vec3(
    gx - (gAcross - 1.) / 2. *  mod(gy, 2.) * 0.5,
    gy - (gDown - 1.) / 2.,
    0.5) *  cos(0.17 + KP1);
  
  float gs = gx / (gAcross-KP3 );
  float gt = (gy / gDown);

  float tm = time - cgv * (1.2 * KP3);
  float su = hash(groupId);
  float s = texture2D(sound, vec2(mix(0.1, 0.5, gs)/KP1, 0.2)).a; 
  float s2 = texture2D(sound, vec2(mix(0.01, 1.5, gs*3.), gt * (11.5 + KP3))).a; 
  
  
  vec3 pos;
  float inner = 0.+KP2;
  float start = 0.7;
  float end   = 2./sin(KP0-2.);
  getCirclePoint(NUM_EDGE_POINTS_PER_CIRCLE, pointId, inner, start, end, pos); 
  pos.z = cgv,mouse.xy;
    
  vec3 eye = vec3(0, 1./KP1, 1);//vec3(sin(time * 0.19) * 0.25, sin(time * 0.21) * 0.25, 2.5);
  vec3 target = vec3(0, 0, 0);//vec3(sin(time * 0.17), sin(time * 0.13), -10);
  vec3 up = vec3(sin(time * 0.3) * 0.02 +KP4, 1.-KP1, 0);
  
  mat4 mat = scale(vec3(1, aspect, 1) * -.2); 
  mat *= cameraLookAt(eye, target, up);
  mat *= rotZ(time * KP3 * mix(-1., 2., mod(circleId, 1.)) + gy * 0.100 * sin(time * 0.1));//sign(offset.x));
  
  
  mat *= trans(offset);
  float h = t2m1(hash(gv));
  mat *= rotZ(time * sign(h) + h + pow(s2+.2, 5.) * KP3  * 10. * sign(h));
  mat *= scale(vec3(0.8/KP0, 0.9, 0.1));
  mat *= rotZ(PI * .25);
  
  gl_Position = mat * vec4(pos, 1.1);
  gl_PointSize = 4.;

  float hue = 2. + cgId * 0.4;
  float sat = 1. - step(pow(s, 1.), abs(gt * 12. - 1.3) * .33);
  float val = 0.9;
  v_color = vec4(hsv2rgb(vec3(hue*mouse.x, sat, val)), (0.0  -h));
  v_color.rgb *= v_color.a;
}
`,
};