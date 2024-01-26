export default {
    name: 'rings_1',
    mode: WebGLRenderingContext.POINTS,
    num: 15000,
    text: `
    #define PI 3.14159

void main () {
  
  float i = vertexId / 2.0;
  if (mod(vertexId, 2.0) > 0.) {
    float snd = texture2D(sound, vec2(i * 1e-4, 0.)).a;

    float ang = mod(1e-3 * i, 3.14159 * 2.) + time * .3;
    float rad = .7 * sin(i + time) * snd;

    float x = rad * cos(ang);
    float y = rad * sin(ang);
    
    gl_Position = vec4(x, y, 0, 1);
    
    float r, g, b;
    
    r = .01 + snd * mod(i, 2.) * .8;
    g = .01 + snd * .8;
    b = .01 + snd * sin(time * 1e-3) * .8;
    
  	v_color = vec4(r, g, b, 1);
  } else {  
    float snd = texture2D(sound, vec2(1./20., 0.)).a;
    float ring = mod(i, 10.);
    
    float rad = 1. - .5 * ring * .05 * sin(time * 5. * i) * snd;
    float ang = mod(1e-3 * i, 3.14159 * 2.);
    
    
    float x = rad * cos(ang);
    float y = rad * sin(ang);
    
    float g = sin(ang) * snd;
    float b = snd * .05;
    
    gl_Position = vec4(x, y, 0, 1);
    v_color = vec4(.1, g, b, 1);
  }
}`,
};