export default {
    name: 'pointsprite plasma',
    mode: WebGLRenderingContext.TRIANGLES,
    num: 3,
    text: `
    

void main()  
{
  vec2 xy = vec2(0.0, 0.0);
  
  if(vertexId == 0.0)
  {
    
    xy = vec2(0.5, 0.0);
    
  }
  
  if(vertexId == 1.0)
  {
    
    xy = vec2(-0.5, 0.0);
    
  }
  
  if(vertexId == 2.0)
  {
    
    xy = vec2(0.0, 0.5);
    
  }
  xy += vec2(0.0,-0.2);
  xy += vec2(0.0, sin(time)/20.0*10.0); 
  
  gl_Position = vec4(xy, 0.0, 1.0);
  v_color = vec4(1.0, 0.0, 0.0, 1.0);
  gl_PointSize = 10.0;
  
  
  
}`,
};