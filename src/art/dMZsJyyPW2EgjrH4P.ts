export default {
    name: 'chulseung.lee',
    mode: WebGLRenderingContext.POINTS,
    num: 950,
    text: `
    /*------------------------------------------------------------------------
Author					 = chulseung.lee
Assignment Name/Number  = Shader/3 (Extra Credit)
Course Name				= CS230
Term					= Spring 2019
------------------------------------------------------------------------*/
#define PI 3.1415926

void main()
{
  float radian = vertexId / (vertexCount) * 3.0 * PI;
  radian *= 3.0;
  
  gl_Position = vec4( cos(radian * mouse.x), sin(radian * mouse.y), 0, 1);
 
  gl_PointSize = 10.0;
  gl_PointSize *= abs(mouse.x)+abs(mouse.y);
  
  v_color = vec4(sin(time*100.0), tan(time*5.0), cos(time*5.0), 1);
}`,
};