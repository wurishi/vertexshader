export default {
    name: 'Hello wobbly triangle',
    mode: WebGLRenderingContext.TRIANGLE_FAN,
    num: 2590,
    text: `
    
const float line = 3. ; 
vec2 drawTriangle(in float vertexId ,out vec3 color )
{
  vec2 res  = vec2(1.);
 // res.x = floor(mod(vertexId , line))/line;
 // res.y = floor(vertexId/ line) ; 
  if(vertexId < (vertexCount / 3. ))
  {
    res.x = -0.5 ; 
    res.y = -0.5 ;  
    color.r = 1.;
    color.g = 0. ; 
    color.b = 0. ; 
    res.x += (sin(-time * 3.0) * 0.1);
    res.y += (cos(-time * 10.0) * 0.1);
  } 
  else if (vertexId > (vertexCount * 2. /3. )) 
  {
    res.x = 0.5 ; 
    res.y = -0.5 ; 
    color.r = 0.;
    color.g = 1. ; 
    color.b = 0. ; 
    res.x += (sin(-time * 10.0) * 0.1);
    res.y += (cos(time * 7.0) * 0.1);
  }
  else
  {
    res.x = 0. ; 
    res.y = 0.5 ;
    color.r = 0.;
    color.g = 0. ; 
    color.b = 1. ; 
    res.x += (sin(time * 5.0) * 0.1);
    res.y += (cos(time * 11.0) * 0.1);
  }
  return res; 
  
}

void main()
{
  vec3 color = vec3(0.);
  
  
  gl_Position = vec4(drawTriangle(vertexId ,color) , 0.0 ,1.) ;
  
  gl_PointSize = 10. ; 
  
  v_color = vec4(color , 1.0);
}`,
};