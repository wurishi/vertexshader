export default {
    name: 'adv_triangle',
    mode: WebGLRenderingContext.TRIANGLES,
    num: 300,
    text: `
#define COLOR_SUNSET

#ifdef COLOR_PASTEL

vec3 gSunColor = vec3(1.0, 0.9, 0.1) * 10.0;  

vec3 gSkyTop =  vec3( 0.1, 0.2, 0.8 ) * 4.0;
vec3 gSkyBottom = vec3( 0.5, 0.8, 1.0 ) * 5.0;

float gFogDensity = 0.01;

vec3 gFloorColor = vec3(0.8, 1.0, 0.8);
vec3 gCubeColor = vec3(1.0, 0.8, 0.8);
float gExposure = 1.0;

float gCubeColorRandom = 0.4;

#endif

#ifdef COLOR_VIVID

vec3 gSunColor = vec3(1.0, 0.9, 0.1) * 10.0;  

vec3 gSkyTop =  vec3( 0.1, 0.2, 0.8 ) * 0.5;
vec3 gSkyBottom = vec3( 0.5, 0.8, 1.0 ) * 1.5;

float gFogDensity = 0.05;

vec3 gFloorColor = vec3(0.4, 1.0, 0.4);
vec3 gCubeColor = vec3(1.0, 0.1, 1.0);
float gExposure = 1.0;

float gCubeColorRandom = 0.9;

#endif


#ifdef COLOR_SUNSET
vec3 gSunColor = vec3(1.0, 0.2, 0.1) * 10.0;  

vec3 gSkyTop = vec3( 1.0, 0.8, 0.5 ) * 0.5;
vec3 gSkyBottom =  vec3( 0.8, 0.2, 0.1 ) * 1.5;

float gFogDensity = 0.05;

vec3 gFloorColor = vec3(1.0, 0.5, 0.5);
vec3 gCubeColor = vec3(1.0, 0.5, 1.0);
float gExposure = 1.0;

float gCubeColorRandom = 0.5;

#endif

#pragma region Pre_Define
#define PI radians(180.)
#pragma endregion 

#pragma region const
const float FARCLIPPED = 1000.  ;
const float NEARCLIPPED = 0.1	  ; 
float g_cameraFar = 1000.0;

#pragma endregion 


#pragma region MatrixConverte 

mat4 mAspect = mat4
(
1, 0, 0, 0,
0, resolution.x / resolution.y, 0, 0,
0, 0, 1, 0,
0, 0, 0, 1
); 
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
#pragma region 

#pragma region Func 
mat4 cameraLookAt(vec3 eye, vec3 target, vec3 up)
{
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

float m1p1(float v) //normalize to NDC 
{
return v * 2. - 1.;
}

float inv(float v) 
{
return 1. - v;
}  



#pragma endregion 


#pragma region GetInfo 


vec3 GetSunDir()
{
return normalize( vec3( 1.0, 0.3, -0.5 ) );
}


void GetMatrixFromZY( const vec3 vZ, const vec3 vY, out mat3 m )
{
vec3 vX = normalize( cross( vY, vZ ) );
vec3 vOrthoY = normalize( cross( vZ, vX ) );
m[0] = vX;
m[1] = vOrthoY;
m[2] = vZ;
}


void GetMatrixFromZ( vec3 vZAxis, out mat3 m )
{
vec3 vZ = normalize(vZAxis);
vec3 vY = vec3( 0.0, 1.0, 0.0 );
if ( abs(vZ.y) > 0.99 )
{
vY = vec3( 1.0, 0.0, 0.0 );
}
GetMatrixFromZY( vZ, vY, m );
}


void GetQuadInfo(const float vertexIndex,
out vec2 quadVertId,

out float quadId )
{
float twoTriVertexIndex = mod( vertexIndex, 6.0 );
float triVertexIndex = mod( vertexIndex, 3.0 );

if 		( twoTriVertexIndex < 0.5 ) quadVertId = vec2( 0.0, 0.0 );
else if	( twoTriVertexIndex < 1.5 )	quadVertId = vec2( 1.0, 0.0 );
else if ( twoTriVertexIndex < 2.5 )	quadVertId = vec2( 0.0, 1.0 );
else if ( twoTriVertexIndex < 3.5 )	quadVertId = vec2( 1.0, 0.0 );
else if ( twoTriVertexIndex < 4.5 )	quadVertId = vec2( 1.0, 1.0 );
else 								quadVertId = vec2( 0.0, 1.0 );

quadId = floor( vertexIndex / 6.0 );
}

void GetQuadTileInfo(const vec2 quadVertId,
    const float quadId,
    const vec2 vDim,
    
    out vec2 vQuadTileIndex,
    out vec2 vQuadUV )
{
vQuadTileIndex.x = floor( mod( quadId, vDim.x ) );
vQuadTileIndex.y = floor( quadId / vDim.x );

vQuadUV.x = floor(quadVertId.x + vQuadTileIndex.x);
vQuadUV.y = floor(quadVertId.y + vQuadTileIndex.y);

vQuadUV = vQuadUV * (1.0 / vDim);
}


void GetQuadTileInfo(const float vertexIndex,
    const vec2 vDim,
    
    out vec2 vQuadTileIndex,
    out vec2 vQuadUV )
{
vec2 quadVertId;
float quadId;
GetQuadInfo( vertexIndex, quadVertId, quadId );  
GetQuadTileInfo( quadVertId, quadId, vDim, vQuadTileIndex, vQuadUV );   
}


float GetCosSunRadius()
{
return 0.01;
}


float GetSunIntensity()
{  	
return 0.001;
}


vec3 GetSkyColor( vec3 vViewDir )
{
return mix( gSkyBottom, gSkyTop, max( 0.0, vViewDir.y ) );
}


vec3 GetBackdropColor( vec3 vViewDir )
{
float VdotL = dot( normalize(vViewDir), GetSunDir() );

VdotL = clamp( VdotL, 0.0, 1.0 );

float fShade = 0.0;

fShade = acos( VdotL ) * (1.0 / PI);

float fCosSunRadius = GetCosSunRadius();

fShade = max( 0.0, (fShade - fCosSunRadius) / (1.0 - fCosSunRadius) );    

fShade = GetSunIntensity() / max( 0.0001, pow(fShade, 1.5) );

vec3 vColor = vec3(0.0);
vColor += GetSkyColor( vViewDir );

vColor += vec3( fShade * gSunColor );
return vColor;
}


#pragma endregion 

#pragma region Scene_Vertex_Collection 
struct SceneVertex
{
vec3 vWorldPos;
vec3 vColor;
float fAlpha;
};
#pragma endregion 

#pragma region DrawScreen 

#define g_Height 			16.
#define g_Width				16.
#define g_Quads 			( g_Height * g_Width)
#define g_VertexCount 		( g_Quads * 6.)

SceneVertex GenerateSTVertex(const float in_fvertexIndex,
            const vec3 in_vCameraPos)
{
SceneVertex out_sv ; 

vec2 vDim = vec2(g_Height, g_Width);
vec2 vTileIndex ; 
vec2 vUV ; 
GetQuadTileInfo(in_fvertexIndex ,
      vDim, 
   vTileIndex,
   vUV);

float pos = 0.  ;
float Pinch = 1. ; 

if(vUV.y > 0. )
{
float t = pow(vUV.y , 1.);
float sunRadis = 0.01 ; 
pos = sunRadis + t * (1. - sunRadis) ; 
}

vec3 vSpherePos ; 
float fElevation = (pos * PI) ; 
vSpherePos.z = cos(fElevation);


float fHeading = vUV.x * PI * 2.0;
float fSliceRadius = sqrt( 1.0 - vSpherePos.z * vSpherePos.z );
vSpherePos.x = sin( fHeading ) * fSliceRadius;
vSpherePos.y = cos( fHeading ) * fSliceRadius;

mat3 m;
vec3 vLocalSpherePos = m * vSpherePos;

float fBackdropDistance = g_cameraFar; 
vec3 vWorldSpherePos = vLocalSpherePos * fBackdropDistance;

out_sv.vWorldPos = vWorldSpherePos;

out_sv.vColor = GetBackdropColor( vLocalSpherePos );

out_sv.fAlpha = 1.0;

GetMatrixFromZ( GetSunDir(), m );

return out_sv ; 
}


SceneVertex GenTriangle(const float in_fVertexIndex)
{
SceneVertex sv ; 
if(in_fVertexIndex < 100.)
{
sv.vWorldPos = vec3(0.2 , -0.2 , 0.);
sv.vColor    = vec3(1. , 0. , 0. ); 
sv.fAlpha    = 1. ; 
}
else if(in_fVertexIndex > 100. && in_fVertexIndex < 200. )
{
sv.vWorldPos = vec3(-0.2 , -0.2, 0. );
sv.vColor    = vec3(0. , 1. , 0. );
sv.fAlpha    = 1. ; 
} 
else 
{
sv.vWorldPos = vec3(0. , 0.2 , 0.);
sv.vColor    = vec3(0., 0. , 1.);
sv.fAlpha    = 1. ; 
}   
return sv;  
}



#pragma endregion 

/* -------------------------------- display ------------------------------- */








































































/* -------------------------------- display ------------------------------- */

void main()
{ 
#pragma region screenSetting 
SceneVertex sv ; 
vec2 vMouse = mouse ; 

#pragma endregion 




#pragma region Start to draw something

float vertexIndex = vertexId; 
sv = GenTriangle(vertexIndex) ; 


#pragma endregion 


#pragma region ProjectionSetUp 
mat4 m  = persp(radians(60.),
    resolution.x/ resolution.y, 
    NEARCLIPPED , 
    FARCLIPPED); 
#pragma endregion 

#pragma region CameraSetUp/ViewSetUp
vec3 target = vec3(0. ) ;
vec3 up = vec3(0. ,1. , 0. ) ;
//target = sv.vWorldPos; 
vec3 camTarget = target ; 
vec3 camPos = vec3(0. , 0. ,1. );  
vec3 camForward = normalize(camTarget - camPos);
m *= cameraLookAt(camPos , camTarget, normalize(up));
#pragma endregion 

#pragma region model 
m *= uniformScale(0.7);
m *= trans(vec3(0.)) ;
m *= rotY(1. * time);
#pragma endregion 


#pragma region Light
vec3 ambient = vec3(0.) ; 
vec3 diffuse = vec3(0.) ;
vec3 specular = vec3(0.);
vec3 result = ambient + diffuse + specular ;
#pragma endregion 



#pragma region add to glsl

gl_Position = m * vec4(sv.vWorldPos, 1.); 
gl_PointSize = 10. ; 
v_color = vec4(sv.vColor * sv.fAlpha, sv.fAlpha);
#pragma endregion 
}`,
};