export default {
    name: 'pointsprite plasma',
    mode: WebGLRenderingContext.POINTS,
    num: 100000,
    text: `
    //time vertexId gl_Position v_color resolution

#define width 256.0
#define height 384.0

float plasma(vec2 pos)
{
  float c = 0.0;
  
  c = sin(time + (cos(pos.x/2.0)*2.0+sin(pos.y/2.0)*2.0));  
  c += sin(time + (cos(pos.x/2.0)*2.0+sin(pos.y/2.0)*2.0)) + 2.0*sin(time + (cos(pos.y/2.0)*2.0+sin(pos.x/2.0)*2.0)) ;
  c += 3.0*sin(time + (cos(pos.x/2.0)*2.0+sin(pos.x/2.0)*2.0));
  c += 4.0*sin(time + (cos(pos.y/2.0)*2.0+sin(pos.y/2.0)*2.0));
    
  c *= 2.0;
  
  return c;
}

void main() {
  float ratio = resolution.x / resolution.y;
  float w = width;
  float h = height / ratio;

  float vId = float(vertexId);
  float px = (mod(vId, w) - w / 2.0) / (w / 2.0);
  float py = (floor(vId / w) - h / 2.0) / (h / 2.0);
  
  gl_Position = vec4(px, py, 0, 1);
  gl_PointSize = 10.0;

  float c = plasma(vec2(px, py) * 4.0);
  v_color = vec4(c, 2.0 * c, 3.0 * c, 1);
}`,
};