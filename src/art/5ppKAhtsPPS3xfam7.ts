export default {
    name: 'sillage',
    mode: WebGLRenderingContext.POINTS,
    num: 5009,
    bg: 0x0000ff,
    text: `
    #define NUM_POINTS 5000.0
//#define FIT_VERTICA

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()
{
  float u = (float(vertexId)/NUM_POINTS) * 2.0 - 1.0;
  float v = 0.0;
  float ucoor = log((abs(u)*.5 + 1.0));
  v+= floor(texture2D(sound,vec2(ucoor,0.0)).a * 15.0)/10.0;
  float osc = 0.2*cos(1.*(1.1*time+3.0*(abs(u)+1.0)));
  float osc2 = 0.2*cos(1.*(-1.5*time+10.0*(u+1.0)));
  float x = u * 2.0;
  float y = v -0.5 + 0.5*pow(x,2.0) + osc +osc2;
  gl_Position = vec4(x,y,0,1);
  float colorfactor = pow(rand(vec2(x,y)),8.);
  gl_PointSize = v*6.0 + colorfactor*1.0;
  float r = mix(0.9,1.,colorfactor);
  float g = mix(0.9,1.,colorfactor);
  float b = 1.;
  
  v_color = vec4(r,g,b,colorfactor+0.5);
}`,
};