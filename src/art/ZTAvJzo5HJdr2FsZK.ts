export default {
    name: 'residuallines',
    mode: WebGLRenderingContext.POINTS,
    num: 3000,
    text: `
    #define NUM_POINTS 5000.0
#define K 1.059463094359295264561825294946
#define FIT_VERTICAL


void main() 
{

  float u = vertexId/soundRes.x;
  float v = 0.0;
  float osc = sin(200.0*time+u*250.0);
  v+= 2.0*pow(texture2D(sound,vec2(u,0.0)).a,6.0);
  float vold = 1.0*pow(texture2D(sound,vec2(u,0.51)).a,10.0);
  float x = (u*10.0)-0.8;
  float y = 0.0;//((v + vold)*0.5);//*osc;
  gl_PointSize = 800.0;
  gl_Position = vec4(x,y,0,1);
  float lum = floor(v *20.0 + 0.7)/10.0;
  v_color = vec4(lum*0.6,lum*0.6,lum*1.0,v);
}`,
};