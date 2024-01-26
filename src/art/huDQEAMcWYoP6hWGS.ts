export default {
    name: 'Galaxy dance',
    mode: WebGLRenderingContext.POINTS,
    num: 100000,
    text: `
    #define PI 3.141

float dis(float n) 
{ 
  return fract(sin(n)*1.50); 
}



void main () 
{
  float Id = dis(vertexId);
  float fr = dis(Id);
  float tex = texture2D(sound, vec2(fr, Id)).a * cos(Id);
  
  tex = pow(tex, 2.);
  
  float pang = vertexId;
  float view = .5 * 1.2;
  float t = (time * (fr + .1))*10.;
  float x = Id * sin(pang + t);
  float y = Id * cos(pang + t);
  
  
  
  y +=  .25 * tex * (1. - y);
  y *= .78;
  
  
  
  float sizeAfter = tex / (y + 1.);
  
  gl_Position = vec4(x, y, 0., 1.);
  gl_PointSize = 6. * sizeAfter;
  
  v_color = vec4(tex * .1 * (3. - fr), tex * .9 * cos(fr * PI), tex * 9., sizeAfter);
  
}`,
};