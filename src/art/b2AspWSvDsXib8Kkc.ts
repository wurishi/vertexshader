export default {
  name: 'Torus Bulb',
  mode: WebGLRenderingContext.TRIANGLES,
  num: 2400,
  text: `
  ////////////////////////////////////////////////////////////
#define PI radians(180.)

mat4 persp(float fov, float aspect, float zNear, float zFar) {
  float f = tan(PI * 0.5 - 0.5 * fov);
  float rangeInv = 1.0 / (zNear - zFar);

  return mat4(
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (zNear + zFar) * rangeInv, -1,
    0, 0, zNear * zFar * rangeInv * 2., 0);
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
////////////////////////////////////////////////////////////

mat3 RotX(float a){return mat3(1.,0.,0.,0.,cos(a),-sin(a),0.,sin(a),cos(a));}
mat3 RotY(float a){return mat3(cos(a),0.,sin(a),0.,1.,0.,-sin(a),0.,cos(a));}
mat3 RotZ(float a){return mat3(cos(a),-sin(a),0.,sin(a),cos(a),0.,0.,0.,1.);}

void main()
{
	gl_PointSize = 3.0;
	
	///////////////////////////////////////////////////////////////////////////////////////
	
	vec3 p = vec3(0);
	
	float indexQuad = floor(vertexId / 6.);
	
	float index = mod(vertexId, 6.);
	
	float countSection = floor(6.);
	
	float indexCircle = floor(indexQuad / countSection);
	
	float astep = 3.14159 * 2.0 / countSection;
	
	float angle0 = indexQuad * astep;
	float angle1 = (indexQuad + 1.) * astep;
	
	float astepTorus = 3.14159 * 2.0 / floor(66.);
	float angleTorus = indexCircle * astepTorus;
	
	float radius = 4. * cos(angleTorus * 1.5 + time) * 2.;
	
	// triangle 1
	if (index == 0.) p = vec3(cos(angle0) * radius, 0., sin(angle0) * radius);
	if (index == 1.) p = vec3(cos(angle1) * radius, 0., sin(angle1) * radius);
	if (index == 2.) p = vec3(cos(angle1) * radius, 1., sin(angle1) * radius);
	
	// triangle 2
	if (index == 3.) p = vec3(cos(angle0) * radius, 0., sin(angle0) * radius);
	if (index == 4.) p = vec3(cos(angle1) * radius, 1., sin(angle1) * radius);
	if (index == 5.) p = vec3(cos(angle0) * radius, 1., sin(angle0) * radius);
	
  	float atten = p.x;
  
	p *= RotX(-angleTorus);
	
	p.z += 11. * cos(angleTorus);
	p.y += 11. * sin(angleTorus);
	
	// cam
	float ca = 3.14159 * 0.6;
	float cd = 50.;
	vec3 eye = vec3(sin(ca), 0.5, cos(ca)) * cd;
	vec3 target = vec3(0, 0, 0);
	vec3 up = vec3(0, 1, 0);
  
	mat4 camera = persp(45. * PI / 180., resolution.x / resolution.y, 0.1, 10000.); 
	camera *= cameraLookAt(eye, target, up);
  
  	// pos
	gl_Position = camera * vec4(p, 1);
	
  	// color
  	p /= atten;
  
	v_color = vec4(normalize(p) * 0.5 + 0.5, 1);
}`,
};