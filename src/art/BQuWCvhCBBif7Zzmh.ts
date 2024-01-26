export default {
    name: 'circle',
    mode: WebGLRenderingContext.TRIANGLES,
    num: 10000,
    text: `
    
void main() 
{

  float ux = floor(vertexId / 6.0) + mod(vertexId, 2.0);
  float vy = mod(floor(vertexId / 2.0) + floor (vertexId /3.0), 2.0);
  
  float angle = ux /20.0 * radians(180.0) * 2.0;
  float radius = vy + 1.0;
  
  float x = radius * cos(angle);
  float y = radius * sin(angle);
  
  vec2 xy = vec2(x,y);
  
  gl_Position= vec4(xy * 0.1, 0.0, 1.0);
  v_color = vec4(1.0, 0.0, 0.0, 1.0);
}`,
};