export default {
    name: 'rings 2',
    mode: WebGLRenderingContext.POINTS,
    num: 100000,
    text: `
    #define PI 3.14159

float hash( float n ) { return fract(sin(n)*753.5453123); }
               
void main () {
  float x, y, z;
  
  float i = hash(vertexId);
    
  if (mod(vertexId, 2.) > 0.) {
    // RIPPLES
    float snd = texture2D(sound, vec2(.7, i)).a;
    
    float rad = .6 * i;
    rad += (snd / rad) * .01;
    float move = (time * .2) + .2 * snd;
    
    float ang = vertexId / (PI * 2.) + move;
    ang *= sin(PI * .5 - rad * PI);
    
    x = rad * cos(ang);
    y = rad * sin(ang) * .7;
    
    v_color = vec4(sin(i * PI), cos(i * PI), i, 1.);
    gl_Position = vec4(x, y, z, 1.);
  } else {
    // RING
    
    z = .1;
    float snd = texture2D(sound, vec2(hash(i), 0.)).a;
    float rad = .6 + .2 * snd;
    
    x = rad * sin(.7 * time + i * PI * 2.);
    y = rad * cos(time + i * PI * 2.);
    
    v_color = vec4(sin(2. * i * PI), cos(2. * i * PI), .5, 1.);
    gl_Position = vec4(x, y, z, 1.);
  }
}`,
};