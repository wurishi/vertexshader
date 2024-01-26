export default {
    name: 'dncrs',
    mode: WebGLRenderingContext.TRIANGLES,
    num: 4608,
    bg: 0xffffff,
    text: `
    /*
























































*/

#define PI radians(180.0)

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


float easeInOutPow(float pos, float pw) {
  if ((pos /= 0.5) < 1.) {
    return 0.5 * pow(pos, pw);
  }
  return 0.5 * (pow((pos - 2.), pw) + 2.);
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

void main() {
  float vId = mod(vertexId, 36.);
  vec3 qpos;
  vec3 qnrm;
  getCubePoint(vId, qpos, qnrm);
  
  float ux = floor(vId / 6.) + mod(vId, 2.);
  float vy = mod(floor(vId / 2.) + floor(vId / 3.), 2.);   
  
  float quadsPerArea = 4.;
  float pointsPerArea = quadsPerArea * 36.;
  float areaId = floor(vertexId / pointsPerArea);
  float numAreas = floor(vertexCount / pointsPerArea);
  float areaV = areaId / numAreas;
  float areaVertId = mod(vertexId, pointsPerArea);
  float rowId = floor(areaVertId / 36.);
  
  float maxBarHeight = 0.025;
  const int numSamples = 20;        // number of history samples to read. So 30 = 1/2 second
  const int samplesPerArea = 64;    // samples across a row. There are 4096 samples I think
                                    // 128 would be 32 area
  
  
  float sampleRangePerArea = soundRes.x / float(samplesPerArea);
  float sampleRangeMult = sampleRangePerArea / float(samplesPerArea) / soundRes.x;     
  
  float timeMaxS = 0.0;
  float instMaxS = 0.0;
  float avgS = 0.0;
  float timeAvgS = 0.0;
  for (int j = 0; j < samplesPerArea; ++j) {
    float su = mix(0., 0.6, pow(areaV, 1.0) + float(j) * sampleRangeMult);
    float s = texture2D(sound, vec2(su, 0)).a;
    avgS += s;
    timeAvgS += s;
    instMaxS = max(s, instMaxS);
    timeMaxS = max(s, timeMaxS);
    for (int i = 1; i < numSamples; ++i) {
      s = texture2D(sound, vec2(su, (float(i) + .5) / soundRes.y)).a;
      timeAvgS += s;
      timeMaxS = max(s, timeMaxS);
    }
  }  
  
  avgS /= float(samplesPerArea);
  timeAvgS /= float(samplesPerArea * numSamples);
  
  float isRow2 = step(1.5, rowId);
  float isRow3 = step(2.5, rowId);
  
  float radius = numAreas * .5;
  mat4 pmat = persp(radians(60.), resolution.x / resolution.y, 0.1, 1000.0);
  vec3 eye = vec3(0, numAreas * .3, radius);
  vec3 target = vec3(0, 3, 0);
  vec3 up = vec3(0, 1, 0);
  
  mat4 vmat = cameraLookAt(eye, target, up);
  mat4 wmat = ident();
  
  float height = 10.;
  float row0 = 0.;
  float row1 = timeMaxS - maxBarHeight * .9;
  float row2 = avgS - maxBarHeight * .9;
  wmat *= scale(
      mix(vec3(1), vec3(1, 0.001, 1.1), isRow3));
  wmat *= rotY(areaV * PI * 2. + time * -.1);
  wmat *= rotZ(mix(-.3, .3, timeAvgS * .7 + sin(time + areaV * PI * 2.) * .1));
  wmat *= trans(vec3(
      numAreas / 4.5, //(areaId - numAreas * .5) * 1.9, 
      mix(mix(row0, row1, step(0.5, rowId)), row2, isRow2) * height * step(rowId, 2.5),
      mix(0., 0., step(2.5,rowId))));
  float scaleFudge = mix(0.75, 1.0, step(0.5, rowId));
  wmat *= scale(vec3(
      scaleFudge, 
      mix(instMaxS, maxBarHeight, step(0.5, rowId)) * height, 
      scaleFudge));
  wmat *= trans(vec3(0., .5, 0));
  wmat *= uniformScale(.5 / .7);
  
  gl_Position = pmat * vmat * wmat * vec4(qpos, 1);
  
  float l = dot(mat3(wmat) * qnrm, normalize(vec3(1,1,3))) * .5 + .5;

  float hue = mix(.3, 0., instMaxS) /* ;areaV * .2 */ + rowId * .8 + step(1.5, rowId) * .0;
  float sat = mix(0.5, 1., instMaxS);
  float val = mix(mix(0.8, 1.0, pow(instMaxS, 3.)), mix(0.2, 2.0, pow(timeMaxS + .2, 5.0)), rowId);
  val = mix(val, mix(0.4, 1.0, avgS), isRow2);
  sat = mix(1., 0., isRow3);
  
  v_color = vec4(hsv2rgb(vec3(hue, sat, val)) * l, 1);
}`,
};
