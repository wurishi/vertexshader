export default {
    name: 'test',
    mode: WebGLRenderingContext.POINTS,
    num: 5009,
    text: `
    #define NUM_POINTS 5000.0
//#define FIT_VERTICAL


void main() 
{
  float u = (float(vertexId)/NUM_POINTS) * 2.0 - 1.0;
  float v = 0.0;
  float ucoor = log((abs(u)*1.5 + 1.0));
  v+= floor(texture2D(sound,vec2(ucoor,0.0)).a * 15.0)/15.0;
  float osc = 0.2*cos(1.*(1.1*time+3.0*(abs(u)+1.0)));
  float osc2 = 0.1*cos(1.*(-1.5*time+5.0*(abs(u)+1.0)));
  float x = u * 2.0;
  float y = v -0.5 + 0.5*pow(x,2.0) + osc +osc2;
  gl_PointSize = v*15.0 + 1.0;
  gl_Position = vec4(x,y,0,1);
  v_color = vec4(1,1,1,1);
}`,
};