export default {
    name: 'thumpy forest - quick test',
    mode: WebGLRenderingContext.TRIANGLE_STRIP,
    num: 45000,
    text: `
//KDrawmode=GL_TRIANGLE_STRIP
//KVerticesNumber=45000

#define numTrackPoints 30000//KParameter0 100.>>30000.0
#define numFunkPoints 3600.0//KParameter1 100.>>3600.0
#define sectionsAcross 10.//KParameter2 5.>>100.0
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

vec3 getQuadStripPoint(const float id) {
  float ux = floor(id / 6.) + mod(id, 2.);
  float vy = mod(floor(id / 2.) + floor(id / 3.), 2.);
  return vec3(ux, vy, 0);
}

void getCirclePoint(const float numEdgePointsPerCircle, const float id, const float inner, const float start, const float end, out vec3 pos) {
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

float Hash( vec2 p) {
     vec3 p2 = vec3(p.xy,1.0);
    return fract(sin(dot(p2,vec3(37.1,61.7, 12.4)))*3758.5453123);
}

float noise(in vec2 p) {
    vec2 i = floor(p);
     vec2 f = fract(p);
     f *= f * (3.0-2.0*f);

    return mix(mix(Hash(i + vec2(0.,0.)), Hash(i + vec2(1.,0.)),f.x),
               mix(Hash(i + vec2(0.,1.)), Hash(i + vec2(1.,1.)),f.x),
               f.y);
}

float fbm(vec2 p) {
     float v = 0.0;
     v += noise(p*1.0)*.5;
//     v += noise(p*2.)*.25;
//     v += noise(p*4.)*.125;
     return v;
}

float crv(float v) {
  return fbm(vec2(v, v * 1.23));
  //float o = sin(v) + sin(v * 2.1) + sin(v * 4.2) + sin(v * 8.9); 
  //return o / 4.;
}

vec3 fgetCurvePoint(float t) {
//  return vec3(sin(-t), sin(t * 0.8), sin(t * 0.6));
//  return vec3( mod(t, 1.) * 0.01, 0, mod(t, 1.));
  return vec3(
    crv(t),
    crv(t + .3),
    crv(t + .6)
  ) * 2. - 1.;
}  

vec3 getCurvePoint(const float id) {
  return vec3(
    sin(id * 0.99),
    sin(id * 2.43),
    sin(id * 1.57));
}

const float expand = 80.;

void track(float vertexId, float vertexCount, float base, out vec3 pos, out vec4 color) {
  //float sectionsAcross = 10.;
  float halfSectionsAcross = sectionsAcross / 2.;
  float pointsPerSection = sectionsAcross * 6.;
  float sectionPointId = mod(vertexId, pointsPerSection);  
  float sectionId = floor(vertexId / pointsPerSection);
  float quadId = floor(sectionPointId / 6.);
  float numSections = (vertexCount / pointsPerSection);
  
  float sideSectionId = mod(quadId, halfSectionsAcross);
  float vert = step(halfSectionsAcross - 1.1, sideSectionId);
  
  float next = mod(floor(vertexId / 2.) + floor(vertexId / 3.), 2.);
  
  float sv = (sectionId + next) / (numSections - 1.);
  float v = sv * 4. + base;
  
  float off = 0.2;
  
  vec3 r0 = getCurvePoint(v + off * 0.);
  vec3 r1 = getCurvePoint(v + off * 1.);
  vec3 r2 = getCurvePoint(v + off * 2.);
  
  vec3 s0 = normalize(r1 - r0);
  vec3 s1 = normalize(r2 - r1);
  
  vec3 zaxis = normalize(s1 - s0);
  vec3 xaxis = normalize(cross(s0, s1));
  vec3 yaxis = normalize(cross(zaxis, xaxis));
  
  mat4 wmat = mat4(
    vec4(xaxis, 0),
    vec4(yaxis, 0),
    vec4(zaxis, 0),
    vec4(r0 * expand, 1)); 

  float lr = mod(vertexId, 2.);
  float asuc = (sideSectionId + lr) / halfSectionsAcross;;
  float s = texture2D(sound, vec2(.1, 1. - sv)).a;
  float s2 = texture2D(sound, vec2(mix(0.05, 0.5, asuc), (1. - sv) * .4)).a;
  
  #if 0
    s = .5;
    s2 = 0.5;
  #endif
  
  float side = mix(-1., 1., step(halfSectionsAcross, quadId));
  float su = (sideSectionId + lr * s) / halfSectionsAcross;

  float width = 1.; 
  //float width = mix(1., 2., pow(s2, .5));
  vec3 pre = mix(
    vec3(su * halfSectionsAcross * side * width, 0, 0), 
    vec3((halfSectionsAcross - 1.) * side * width, lr * 5. * s, 0), 
    vert); 
  pos = (wmat * vec4(pre * .4, 1)).xyz;
  vec3 nrm = mix(vec3(0, 1, 0), vec3(sign(pos.x), 0, 0), vert);    
  
  float hue = asuc * .1 + pow(s2, 5.) + time * 0.1;
  float sat = mix(1.2, 0.2, vert);// + (sin(sv * 20.) * 1.5);
  float val = mix(0.25, 1., pow(s2 + .4, 15.) * pow(s + .4, 15.)) + abs(sin(sv * 40.) * .25);
  
  float pump = step(0.5, s2);
  sat = mix(sat, 1., vert * pump);
  val = mix(val, 1., vert * pump);
  hue = mix(hue, hue + .15, vert * pump);
  
  //hue += sign(pre.x) * .25;
  
  vec3 n = normalize((wmat * vec4(nrm, 0)).xyz);
  
  vec3 lightDir = normalize(vec3(-0.3, .3, 0.2));

  vec3 c = hsv2rgb(vec3(hue, sat, val));
  color = vec4(c * mix(0.5, 1.0, abs(dot(n, lightDir))), 1);
  
  //color.rgb = zaxis * .5 + .5; 
  color.a = 1. - pow(sv, 20.0);
  color.rgb *= color.a;
}

void funk(const float vertexId, float vertexCount, float base, out vec3 pos, out vec4 color) {
  //float sectionsAcross = 30.;
  float halfSectionsAcross = sectionsAcross / 2.;
  float pointsPerSection = sectionsAcross * 6.;
  float sectionPointId = mod(vertexId, pointsPerSection);  
  float sectionId = floor(vertexId / pointsPerSection);
  float quadId = floor(sectionPointId / 6.);
  float numSections = (vertexCount / pointsPerSection);
  
  float sideSectionId = mod(quadId, halfSectionsAcross);
  float sideV = sideSectionId / halfSectionsAcross;
  
  float lr = mod(vertexId, 2.);
  float next = mod(floor(vertexId / 2.) + floor(vertexId / 3.), 2.);
  float side = mix(-1., 1., step(halfSectionsAcross, quadId));
  
  float sv = (sectionId + next * .4) / (numSections - 1.);
  float v = sv * .2 + base + .1;
  
  float s = texture2D(sound, vec2(.1, mix(0.9, 1.0, (1. - sv)))).a;
  float s2 = texture2D(sound, vec2(mix(0.05, 0.5, sideV), (1. - sv) * .4)).a;
    
  float off = 0.2;
  
  vec3 r0 = getCurvePoint(v + off * 0.);
  vec3 r1 = getCurvePoint(v + off * 1.);
  vec3 r2 = getCurvePoint(v + off * 2.);
  
  vec3 s0 = normalize(r1 - r0);
  vec3 s1 = normalize(r2 - r1);
  
  vec3 tzaxis = normalize(s1 - s0);
  vec3 txaxis = normalize(cross(s0, s1));
  vec3 tyaxis = normalize(cross(tzaxis, txaxis));
  
  const float height = .05;
  const float period = 2.;
  const float speed = 2.;
  const float lPeriod = 0.5;
  
  float sx = (sideV + lr / halfSectionsAcross);
  float bt = sx * period + time * speed + sv * lPeriod;
  float bh = sin(bt) * height;
  
  vec3 foff = tyaxis * bh;// - tyaxis * height * 0. + txaxis * side * sin(sx * PI) * 0.;
  float unit = 1. / halfSectionsAcross;
  
  float y0 = sin((sx + unit * 1. + sv * lPeriod) * period + time * speed);
  float y1 = sin((sx + unit * 2. + sv * lPeriod) * period + time * speed);
  float y2 = sin((sx + unit * 3. + sv * lPeriod) * period + time * speed);
  
  r0 += tzaxis * -.01;
  
  vec3 rb0 = r0 + tzaxis * (-1. + y0) * height + txaxis * 1. * side * .1 * sx * cos(y0);
  vec3 rb1 = r0 + tzaxis * (-1. + y1) * height + txaxis * 1. * side * .1 * sx * cos(y1);
  vec3 rb2 = r0 + tzaxis * (-1. + y2) * height + txaxis * 1. * side * .1 * sx * cos(y2);
  
  vec3 sb0 = normalize(rb1 - rb0);
  vec3 sb1 = normalize(rb2 - rb1);
  
  vec3 zaxis = normalize(sb1 - sb0);
  vec3 xaxis = normalize(cross(sb0, sb1));
  vec3 yaxis = normalize(cross(zaxis, xaxis));
  
  mat4 wmat = mat4(
    vec4(xaxis, 0),
    vec4(yaxis, 0),
    vec4(zaxis, 0),
    vec4(rb0 * expand, 1)); 

  #if 0
    s = 1.;
    s2 = 1.;
  #endif
  
  float su = (sideSectionId + lr) / halfSectionsAcross;

  float width = 1.; 
  pos = (wmat * vec4(0, next * s, 0, 1)).xyz;
  vec3 nrm = vec3(0, 1, 0);
  
  float hue = sideV * .2 + time * .1; //sideV * .1 + pow(s2, 5.) + time * 0.1;
  float sat = 0.3;
  float val = s;1.;//mix(0.25, 1., pow(s2 + .4, 15.) * pow(s + .4, 15.)) + abs(sin(sv * 40.) * .25);
  
  vec3 n = normalize((wmat * vec4(nrm, 0)).xyz);
  
  vec3 lightDir = normalize(vec3(-0.3, .3, 0.2));

  vec3 c = hsv2rgb(vec3(hue, sat, val));
  color = vec4(c * mix(0., 1.0, abs(dot(n, lightDir))), 1);
}

void sky(const float vertexId, float base, const mat4 cmat, out vec3 pos, out vec4 color) {
  float starId = floor(vertexId / 3.);
  float pId = mod(vertexId, 3.);
  pos = normalize(vec3(
    t2m1(hash(starId * 0.123)),
    t2m1(hash(starId * 0.353)),
    t2m1(hash(starId * 0.627)))) * 500.;
  pos += cmat[0].xyz * 2. * step(0.5, pId);
  pos += cmat[1].xyz * 2. * step(1.5, pId);
  float c = hash(starId * 0.017);
  color = vec4(c, c, c, 1);
}

void main() {
  //const float numTrackPoints = 30000.0;
  float finalNumFunkPoints = 3.*numFunkPoints;     // must be multiple of 3
    
  //float base = 15.;  // good place to adjust
  float base = time * 0.5;

  const float coff = 0.14;
  
  vec3 b0 = getCurvePoint(base + coff * 0.);
  vec3 b1 = getCurvePoint(base + coff * 1.);
  vec3 b2 = getCurvePoint(base + coff * 2.);
  
  vec3 c0 = normalize(b1 - b0);
  vec3 c1 = normalize(b2 - b1);
  
  vec3 czaxis = normalize(c1 - c0);
  vec3 cxaxis = normalize(cross(c0, c1));
  vec3 cyaxis = normalize(cross(czaxis, cxaxis));
  
  mat4 pmat = persp(radians(60.0), resolution.x / resolution.y, .1, 1000.0);

  vec2 ms = vec2(0); //texture2D(touch, vec2(0, 0)).xy + vec2(0, 1);  
  
  vec3 eye    = b0 * expand + cyaxis * .001 + czaxis * 2.2;
  vec3 target = b1 * expand + cyaxis * .002 + czaxis + ms.x * cxaxis * 2. + ms.y * cyaxis * 40.;
  vec3 up     = cyaxis;
  
  mat4 cmat = lookAt(eye, target, up);
  mat4 vmat = rotZ(asin(up.y) * 1.) * inverse(cmat);
  
  vec3 pos;
  vec4 color;
  
  float id = vertexId;
  if (id < finalNumFunkPoints) {
    track(id, finalNumFunkPoints, base, pos, color);
  } else {
    id -= finalNumFunkPoints;
    if (id < numFunkPoints) {
      funk(id, numFunkPoints, base, pos, color);
    } else {
      id -= numFunkPoints;
      sky(id, base, cmat, pos, color);
    }
  }
  
  gl_Position = pmat * vmat * vec4(pos, 1);
  v_color = color;
}
`,
};