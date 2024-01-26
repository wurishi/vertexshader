export default {
    name: 'blrp',
    mode: WebGLRenderingContext.TRIANGLES,
    num: 100000,
    text: `
    /* 👾 */






























































#define PI radians(180.)

vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

mat4 rotX(float angleInRadians) {
    float s = sin(angleInRadians);
    float c = cos(angleInRadians);
  	
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
    xAxis, 0,
    yAxis, 0,
    zAxis, 0,
    -dot(xAxis, eye), -dot(yAxis, eye), -dot(zAxis, eye), 1);  
  #endif
  
}



// hash function from https://www.shadertoy.com/view/4djSRW
float hash(float p) {
	vec2 p2 = fract(vec2(p * 5.3983, p * 5.4427));
    p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
	return fract(p2.x * p2.y * 95.4337);
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
  float outId = id - floor(id / 3.) * 2. - 1.;   // 0 1 2 3 4 5 6 7 8 .. 0 1 2, 1 2 3, 2 3 4
  float ux = floor(id / 6.) + mod(id, 2.);
  float vy = mod(floor(id / 2.) + floor(id / 3.), 2.); // change that 3. for cool fx
  float u = ux / numEdgePointsPerCircle;
  float v = mix(inner, 1., vy);
  float a = mix(start, end, u) * PI * 2. + PI * 0.0;
  float s = sin(a);
  float c = cos(a);
  float x = c * v;
  float y = s * v;
  float z = 0.;
  pos = vec3(x, y, z);  
}


#define CUBE_POINTS_PER_FACE 6.
#define FACES_PER_CUBE 6.
#define POINTS_PER_CUBE (CUBE_POINTS_PER_FACE * FACES_PER_CUBE)
void getCubePoint(const float id, out vec3 position, out vec3 normal) {
  float quadId = floor(mod(id, POINTS_PER_CUBE) / CUBE_POINTS_PER_FACE);
  float sideId = mod(quadId, 3.);
  float flip   = mix(1., -1., step(2.5, quadId));
  // 0 1 2  1 2 3
  float facePointId = mod(id, CUBE_POINTS_PER_FACE);
  float pointId = mod(facePointId - floor(facePointId / 3.0), 6.0);
  float a = pointId * PI * 2. / 4. + PI * 0.25;
  vec3 p = vec3(cos(a), 0.707106781, sin(a)) * flip;
  vec3 n = vec3(0, 1, 0) * flip;
  float lr = mod(sideId, 2.);
  float ud = step(2., sideId);
  mat4 mat = rotX(lr * PI * 0.5);
  mat *= rotZ(ud * PI * 0.5);
  position = (mat * vec4(p, 1)).xyz;
  normal = (mat * vec4(n, 0)).xyz;
}

float pinch(float v, float p) {
  if (v < 0.5) {
    return pow(v * 2., p) * .5;
  } 
  return 1. - pow(1. - (v - 0.5) * 2., p);
}


// adapted from http://stackoverflow.com/a/26127012/128511

vec3 fibonacciSphere(float samples, float i) {
  float rnd = 1.;
  float offset = 2. / samples;
  float increment = PI * (3. - sqrt(5.));

  //  for i in range(samples):
  float y = ((i * offset) - 1.) + (offset / 2.);
  float r = sqrt(1. - pow(y ,2.));

  float phi = mod(i + rnd, samples) * increment;

  float x = cos(phi) * r;
  float z = sin(phi) * r;

  return vec3(x, y, z);
}

void getSphereVertex(float vertexId, float vertexCount, float around, 
                     out vec3 pos, out vec3 nrm, out vec2 uv) {
  float numQuads = floor(vertexCount / 6.);
  float down = numQuads / around;
  float quadId = floor(float(vertexId) / 6.);

  float qx = mod(quadId, around);
  float qy = floor(quadId / around);

  // 0--1 3
  // | / /|
  // |/ / |
  // 2 4--5
  //
  // 0 1 0 1 0 1
  // 0 0 1 0 1 1

  float edgeId = mod(float(vertexId), 6.);
  float ux = mod(edgeId, 2.);
  float vy = mod(floor(edgeId / 2.) + floor(edgeId / 3.), 2.);

  float qu = (qx + ux) / around;
  float qv = (qy + vy) / down;

  float r = sin(qv * PI);
  float x = cos(qu * PI * 2.) * r;
  float z = sin(qu * PI * 2.) * r;

  pos = vec3(x, cos(qv * PI), z);
  nrm = normalize(pos);
  uv = vec2(qu, qv);
}


void main() {
  if (vertexId < 6.) {
    float id = vertexId;
    float ux = floor(id / 6.) + mod(id, 2.);
    float vy = mod(floor(id / 2.) + floor(id / 3.), 2.); // change that 3. for cool fx

    gl_Position = vec4(ux, mix(-1., 1., vy), 0.999, 1);
    v_color = vec4(0);
    return;
    
  }
  float pointId = vertexId;  

  vec3 pos;
  vec3 normal;
  vec2 uv;
  float around = 12.0;
  float down = 6.0;
  float vertsPerSphere = around * down * 6.;
  getSphereVertex(mod(pointId, vertsPerSphere), vertsPerSphere, around, pos, normal, uv);
  float cubeId = floor(pointId / vertsPerSphere);
  float maxCubes = floor(vertexCount / vertsPerSphere);
  float numCubes = maxCubes;// * mix(0.1, 1., t5p5(sin(time * .05)));

  vec3 loc = fibonacciSphere(numCubes, cubeId);

  float cv = cubeId / numCubes;
  float su = (cv);
  //su = hash(cubeId / maxCubes);
  float s1 = texture2D(sound, vec2(mix(.05, .00, fract(su + 1.0)), 0. / soundRes.y)).a;
  float s2 = texture2D(sound, vec2(mix(.06, .01, fract(su + 0.8)), 1. / soundRes.y)).a;
  float s3 = texture2D(sound, vec2(mix(.07, .02, fract(su + 0.6)), 2. / soundRes.y)).a;
  float s4 = texture2D(sound, vec2(mix(.08, .03, fract(su + 0.4)), 3. / soundRes.y)).a;
  
  float s = max(max(max(s1, s2), s3), s4);mix(0.0, 0.25, s1 + s2 + s3 + s4);
  
  float tm = time * .1;
  float r = 50.;
  mat4 mat = persp(radians(100.0), resolution.x / resolution.y, 1., 200.0);
  vec3 eye = vec3(cos(tm) * r, sin(tm) * r * 0. + r, sin(tm) * r);
  vec3 target = vec3(0);
  vec3 up = vec3(0,1,0);
  
  float sc = mix(1.8, 20., pow(1. - numCubes / maxCubes, 10.));
  mat *= cameraLookAt(eye, target, up);
  float r2 = mix(25., 50., sin(cv * PI * 2. + time) * 0.5 + 0.5);
  mat *= rotX(tm);
  mat *= lookAt(loc * r2, vec3(0), up);
//  mat *= scale(vec3(sc, sc, mix(1., 2.5, pow(s, 1.0))));
//  mat *= trans(vec3(0, 0, 1));
//  mat *= rotZ(s * PI * 2.);
  mat *= uniformScale(5.0 + pow(s, 5.) * 5.);
  
  gl_Position = mat * vec4(pos, 1);
  vec3 n = normalize((mat * vec4(normal, 0)).xyz);
  
  vec3 lightDir = normalize(vec3(0.3, 0.4, -1));


  float hue = 1.05 + pow(s, 5.) * -.15 + uv.y * .1;
  float sat = 1.2; + s;
  float val = 1.;
  vec3 color = hsv2rgb(vec3(hue, sat, val));
  float lt = (dot(n, lightDir) * 0.5 + 0.5);
  v_color = vec4(color * lt, 1);
//  v_color.a = s;
  v_color.rgb *= v_color.a; 
//  if (s < .2) {
//    gl_Position.z = 10000.;
//  }
}

`,
};