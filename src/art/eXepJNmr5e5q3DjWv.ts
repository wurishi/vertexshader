export default {
    name: 'cubit',
    mode: WebGLRenderingContext.LINES,
    num: 100000,
    text: `

#define PI radians( 180. )

vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// hash function from https://www.shadertoy.com/view/4djSRW
float hash(float p)
{
	vec2 p2 = fract(vec2(p * 5.3983, p * 5.4427));
    p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
	return fract(p2.x * p2.y * 95.4337);
}


mat4 rotX( float angle ) {
    float s = sin( angle );
    float c = cos( angle );
  	
    return mat4( 
      1, 0, 0, 0,
      0, c, s, 0,
      0,-s, c, 0,
      0, 0, 0, 1);  
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
  #if 0
  return mat4(
    1, 0, 0, trans[0],
    0, 1, 0, trans[1],
    0, 0, 1, trans[2],
    0, 0, 0, 1);
  #else
  return mat4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    trans, 1);
  #endif
}

mat4 ident() {
  return mat4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1);
}

mat4 uniformScale(float s) {
  return mat4(
    s, 0, 0, 0,
    0, s, 0, 0,
    0, 0, s, 0,
    0, 0, 0, 1);
}

mat4 scale(vec3 s) {
  return mat4(
    s[0], 0, 0, 0,
    0, s[1], 0, 0,
    0, 0, s[2], 0,
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
    xAxis, 0,
    yAxis, 0,
    zAxis, 0,
    -dot(xAxis, eye), -dot(yAxis, eye), -dot(zAxis, eye), 1);  
  #endif
  
}

float m1p1(float v) {
  return v * 2. - 1.;
}

float p1m1(float v) {
  return v * 0.5 + 0.5;
}

float inRange(float v, float minV, float maxV) {
  return step(minV, v) * step(v, maxV);
}

float at(float v, float target) {
  return inRange(v, target - 0.1, target + 0.1);
}

void getShapePoint(const float numPointsPerFace, const float id, const mat4 wvp, out vec4 pos) {
  float numPointsPerShape = pow(numPointsPerFace, 3.);
  float numPointsPerWhat = numPointsPerFace * numPointsPerFace;
  float aId = mod(id, numPointsPerFace);
  float a   = aId / numPointsPerFace;
  float bId = mod(floor(id / numPointsPerFace), numPointsPerFace);
  float b   = bId / numPointsPerFace;
  float cId = floor(id / numPointsPerWhat);
  float c   = cId / numPointsPerFace;
  float a0  = a * PI * 2.;
  float b0  = b * PI * 2.;
  float c0  = c * PI * 2.;
  
  mat4 m = wvp;
  m *= rotZ(c0);
  m *= rotY(b0);
  m *= rotY(a0);
  pos = m * vec4(1,1,1,1);
}


void main() { 
  	float animTime = time;
  
  	float orbitAngle = animTime * 0.03456;
  	float elevation = sin(animTime * 0.223);
  	float fOrbitDistance = 30.;
  
    vec3 target = vec3(0, 0, 0);
    vec3 eye = vec3(0, 0, 10);
  	     eye = vec3( sin(orbitAngle) * fOrbitDistance , sin(elevation * 1.11) * 10. , cos(orbitAngle)* fOrbitDistance ) ;
    vec3 up = vec3(0,1,0);
  
    float numPointsPerFace = 4.;
    float numPointsPerShape = pow(numPointsPerFace, 3.);
    float shapeId = floor(vertexId / numPointsPerShape); 
    float shapeCount = floor(vertexCount / numPointsPerShape);
  
    float size = floor(pow(shapeCount, 1./3.));
    vec3 p = vec3(
      mod(shapeId, size),
      mod(floor(shapeId / size), size),
      floor(floor(shapeId / size) / size));
    vec3 pv = p / size;
  
    float snd = texture2D(sound, vec2(0.05 + pv.x * 0.25, pv.z * 0.2)).a; 
  
    vec4 pos;
    mat4 m = ident();
    m *= persp(45., resolution.x / resolution.y, 0.1, 60.);
    m *= cameraLookAt(eye, target, up);
    m *= trans((pv * 2. - 1.) * 16.);
    m *= uniformScale(pow(snd,3.));
    getShapePoint(numPointsPerFace, vertexId, m, pos);

    gl_Position = pos;
    gl_PointSize = 4.;
    float z = p1m1(pos.z / pos.w);
  
  	// Final output color
    v_color = vec4(1,snd,0,z);
  	v_color = vec4(v_color.rgb * v_color.a, v_color.a);
}`,
};
