export default {
    name: 'Crap',
    mode: WebGLRenderingContext.TRIANGLE_STRIP,
    num: 1000,
    text: `
    #define PI radians(180.)

void main() {

  float stripId = mod(vertexId, 2.0);
  float norId = vertexId / vertexCount;
  
  float x = norId - 0.5;
  float y = stripId - 0.5;
  
  float ar = resolution.x / resolution.y;
  
  y += sin(x  * 50.0) * sin(time);  
  y *= cos(time);
  
  vec2 p = vec2(x * ar, y);
  p.y -= abs(norId - 0.5) * 2.0;
  
  gl_Position = vec4(p.x, p.y, 0, 1);

  v_color = vec4(1,1,1,1);
}`,
};