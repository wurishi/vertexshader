export default {
    name: 'French Lorenz Attractor',
    mode: WebGLRenderingContext.LINES,
    num: 30000,
    text: `
    
// Created by Stephane Cuillerdier - Aiekick/2018 (twitter:@aiekick)
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Tuned via XShade (http://www.funparadigm.com/xshade/)

////////////////////////////////////////////////////////////
#define PI radians(180.)
mat4 persp(float fov, float aspect, float zNear, float zFar);
mat4 lookAt(vec3 eye, vec3 target, vec3 up);
mat4 inverse(mat4 m);
mat4 cameraLookAt(vec3 eye, vec3 target, vec3 up);
////////////////////////////////////////////////////////////

mat3 RotX(float a){return mat3(1.,0.,0.,0.,cos(a),-sin(a),0.,sin(a),cos(a));}
mat3 RotY(float a){return mat3(cos(a),0.,sin(a),0.,1.,0.,-sin(a),0.,cos(a));}
mat3 RotZ(float a){return mat3(cos(a),-sin(a),0.,sin(a),cos(a),0.,0.,0.,1.);}
mat4 Trans(float x, float y, float z){return mat4(1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1);}

// https://en.wikipedia.org/wiki/Lorenz_system

// exponential smooth min (k = 32);
// http://www.iquilezles.org/www/articles/smin/smin.htm
vec3 sminExp( vec3 a, vec3 b, vec3 k )
{
    vec3 res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}

void main()
{
	float sigma = 10.;
	float rho = 28.;
	float beta = 2.66;
	float speed = 0.00470;
  	float transitionStrength = 0.75;
  	vec3 colKernel0 = vec3(1,0,0);
  	vec3 colKernel1 = vec3(0,0,1);
  	vec3 colTransition = vec3(1,1,1);
	const float maxIterations = 30000.;
  
	vec3 new = vec3(0);
	vec3 last = vec3(0);
	
	gl_Position = vec4(0);
	v_color = vec4(0,0,0,0);
	
	float vtId = vertexId;
	
	for (float i=0.; i < maxIterations; i++)
	{
      	if (i > vtId) break;
		last = new;
		new.x = sigma * (last.y - last.x);
		new.y = rho * last.x - last.y - last.x * last.z ;
		new.z = last.x * last.y - beta * last.z;
		new = new * speed + speed;
		new += last;
	}
	
  	// eachs two points, same points, for avoid path interruptions in LINES mode
	if (mod(vertexId, 2.) < 1.) 
	{
		new = last;
		vtId++;
	}
	
	// kernel 0
	vec3 k0 = vec3(0);
	k0.x = -sqrt(beta * (rho - 1.));
	k0.y = -sqrt(beta * (rho - 1.));
	k0.z = rho - 1.;
	float dk0 = length(new-k0);
			
	// kernel 1
	vec3 k1 = vec3(0);
	k1.x = sqrt(beta * (rho - 1.));
	k1.y = sqrt(beta * (rho - 1.));
	k1.z = rho - 1.;
	float dk1 = length(new-k1);
	
	float dk = sminExp(vec3(dk0), vec3(dk1), vec3(0.01)).x;
	
	vec3 center = (k0 + k1) * 0.5;
	float diam = length(k0-center);
	
	float rk0 = dk0/(dk1*transitionStrength);;
	float rk1 = dk1/(dk0*transitionStrength);
	
  	float sk0 = -30. * texture2D(sound, vec2(0.0, (1.-rk0)*0.2)).x*0.5;
	float sk1 = 30. * texture2D(sound, vec2(0.1, (1.-rk1)*0.2)).x*0.5;
	
	
	vec3 pathk0 = vec3(sk0 * rk0, 0., 0.);;
	vec3 pathk1 = vec3(sk1 * rk1, 0., 0.);
	vec3 path = sminExp(pathk0, pathk1, vec3(0.012));

	new = new.xzy;

	if (dk0 < dk1)
	{
		v_color.rgb = mix(colKernel0,colTransition, vec3(rk0));
	}
	else
	{
		v_color.rgb = mix(colKernel1,colTransition, vec3(rk1));
	}
	
	///////////////////////////////////////////////////////////////////////////////////////
	float ca = 0.5 - mouse.x * 0.5;
	float ce = -1.5+mouse.y * 3.;
	float cd = 80.0;
	vec3 eye = vec3(cos(ca), sin(ce), sin(ca)) * cd; 
	vec3 target = vec3(0, 0, 0);
	vec3 up = vec3(0, 1, 0);
  
	mat4 camera = persp(45. * PI / 180., resolution.x / resolution.y, 0.1, 10000.); 
	camera *= cameraLookAt(eye, target, up);
	camera *= Trans(76.,47.,66.);
	gl_Position = camera * vec4(new + path,1);
}

////////////////////////////////////////////////////////////

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
  
	}`,
};