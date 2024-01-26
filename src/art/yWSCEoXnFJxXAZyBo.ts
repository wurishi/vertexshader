export default {
    name: 'ball',
    mode: WebGLRenderingContext.TRIANGLES,
    num: 100000,
    text: `

#define PI radians(180.)

vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


mat4 rotX(float angle) {

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
float hash(float p)
{
	vec2 p2 = fract(vec2(p * 5.3983, p * 5.4427));
    p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
	return fract(p2.x * p2.y * 95.4337);
}

float m1p1(float v) {
  return v * 2. - 1.;
}

float p1m1(float v) {
  return v * .5 + .5;
}

float inRange(float v, float minV, float maxV) {
  return step(minV, v) * step(v, maxV);
}

float at(float v, float target) {
  return inRange(v, target - 0.1, target + 0.1);
}

float hashp(float p) {
  return m1p1(hash(p));
}


#define SEGS 16.
void main() {
  float pointsPerSphere = SEGS * (SEGS * 0.5) * 6.;
  float sphereId = floor(vertexId / pointsPerSphere);
  float numSpheres = floor(vertexCount / pointsPerSphere);
  float su = sphereId / numSpheres;
  
  float v = mod(vertexId, pointsPerSphere);
  float vertex = mod(v, 6.);
  v = (v-vertex)/6.;
  float a1 = mod(v, SEGS);
  v = (v-a1)/SEGS;
  float a2 = v-(SEGS / 4.);
  
  float a1n = (a1+.5)/SEGS*2.*PI;
  float a2n = (a2+.5)/SEGS*2.*PI;
  
  a1 += mod(vertex,2.);
  a2 += vertex==2.||vertex>=4.?1.:0.;
  
  a1 = a1/SEGS*2.*PI;
  a2 = a2/SEGS*2.*PI;
  
  vec3 pos = vec3(cos(a1)*cos(a2),sin(a2),sin(a1)*cos(a2));
  vec3 norm = vec3(cos(a1n)*cos(a2n),sin(a2n),sin(a1n)*cos(a2n));
  
  float snd0 = texture2D(sound, vec2(su * 0.2 + 0.05, 0)).a;
  /*
  #define NUM_SAMPLES 8
  float csnd = 0.;
  for (int i = 0; i < NUM_SAMPLES; ++i) {
    csnd += texture2D(sound, vec2(0.05, float(i) / float(NUM_SAMPLES) * 0.1)).a;
  }
  csnd /= float(NUM_SAMPLES);
  */
  float csnd = 0.;
  float cangle = time + csnd * PI * 2.;
  float c = cos(cangle);
  float s = sin(cangle);
  float r = 1.5;
  vec3 cameraPos    = vec3(c * r, sin(time * 0.57), s * r);
  vec3 cameraTarget = vec3(0, 0, 0);
  vec3 cameraUp     = vec3(0, 1, 0);
  
  mat4 p = persp(radians(65.), resolution.x / resolution.y, 0.1, 100.);
  mat4 cam = lookAt(cameraPos, cameraTarget, cameraUp);
  mat4 view = inverse(cam);
  
  mat4 w = trans(vec3(hashp(sphereId * 0.43), hashp(sphereId * 1.39), hashp(sphereId * 2.11)));
  w *= uniformScale(mix(1.1, 2.5, hash(sphereId * 0.37)) * pow(snd0, 5.)) ;
  w *= rotX(hash(sphereId * 0.791) * PI * 2.);
  gl_Position = p * view * w * vec4(pos, 1);

  vec3 lightDir = normalize(vec3(1.1, 2.0, 2.0));
  lightDir = normalize((cam * vec4(lightDir, 0)).xyz);
  norm = normalize((w * vec4(norm, 0)).xyz);
  float light = mix(0.5, 1., abs(dot(norm, lightDir)));
  
  float hue = mix(0.95, 1.00, hash(sphereId));
  float sat = mix(1.4, 1.7, hash(sphereId * 6.131));
  float val = light;
  v_color = vec4(
    mix(hsv2rgb(vec3(hue, sat, val)),
        vec3(1,1,1),
        step(10.9, snd0)), 1);
}`,
};