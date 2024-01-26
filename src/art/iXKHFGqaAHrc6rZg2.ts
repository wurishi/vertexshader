export default {
    name: 'Triangular Voronoi',
    mode: WebGLRenderingContext.TRIANGLES,
    num: 100000,
    text: `
    ////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////

vec3 triangle(float idx) // vec2:p / float triangleIndex
{
	float triangleIndex = floor(idx / 6.);

	float index = mod(idx, 6.);
	
	vec2 p = vec2(0);
	
	if (index == 0.) p = vec2(0,0);
	if (index == 1.) p = vec2(1,0);
	if (index == 2.) p = vec2(1,1);
	
	if (index == 3.) p = vec2(0,0);
	if (index == 4.) p = vec2(1,1);
	if (index == 5.) p = vec2(0,1);
	
	return vec3(p, triangleIndex);
}

vec4 gridMesh(float idx, float countQuadsX, bool centered) // vec2 p / vec2 size
{
	vec4 res;
	vec3 pi = triangle(idx);
	
	pi.y += floor(pi.z / countQuadsX);
    pi.x += mod(pi.z, countQuadsX);
    
	float countQuads = floor(vertexCount / 6.);
	float nx = countQuadsX;
	float ny = floor(countQuads / nx);
		
	if (centered == true)
	{
		pi.x -= nx * 0.5;
		pi.y -= ny * 0.5;
	}
	
	return vec4(pi.xy, nx, ny);
}

//https://www.shadertoy.com/view/ltK3WD
vec4 voronoi(vec2 g )
{
	vec4 f = vec4(9);
	vec2 p = g /= 200. ; f.x=9.;
    
	g += time;
	
    float t = time * 0.1;
    
    for(int x=-2;x<=2;x++)
    for(int y=-2;y<=2;y++)
    {	
        p = vec2(x,y);
		p += .5 + .5*sin( t * 10. + 9. * fract(sin((floor(g)+p)*mat2(2,5,5,2)))) - fract(g);
        //p *= mat2(cos(t), -sin(t), sin(t), cos(t));
        f.y = max(abs(p.x)*.866 - p.y*.5, p.y);
		//f.y = max(abs(p.x), abs(p.y));
		//f.y = dot(p,p);
		if (f.y < f.x)
        {
            f.x = f.y;
            f.zw = p;
        }
    }
	
    vec3 n = vec3(0);
    
    if ( f.x == -f.z*.866 - f.w*.5) 	n = vec3(1,0,0);
	if ( f.x == f.z*.866 - f.w*.5) 		n = vec3(0,1,0);
	if ( f.x == f.w) 					n = vec3(0,0,1);
	
    return vec4(f.x, n);
}

void main()
{
	gl_PointSize = 2.;
	
  	vec3 uSlider = vec3(50, 2, 1.2);
  
	float thickNess = uSlider.x;
	float countMax = floor(vertexCount / 6.);
	float sizeEdge = floor(sqrt(countMax));
	vec4 p = gridMesh(vertexId, sizeEdge, true) * uSlider.z;
	
	vec4 voro = voronoi(p.xy * uSlider.y);
	
	float d = voro.x;
	vec3 n = voro.yzw;
	
	v_color = vec4(n*d,1);
	
	mat4 camera = ident();
	
	float ca = time * 0.1;
	float cd = 200.;
	float ce = PI * mouse.y;
	vec3 eye = vec3(sin(ca), sin(ce), cos(ca)) * cd;
	vec3 target = vec3(0, 0, 0);
	vec3 up = vec3(0, 1, 0);
  
	camera = persp(45. * PI / 180., resolution.x / resolution.y, 0.1, 10000.); 
	camera *= cameraLookAt(eye, target, up);
  
	gl_Position = camera * vec4(p.x, voro.x * thickNess - thickNess * 0.5, p.y, 1);
}`,
};