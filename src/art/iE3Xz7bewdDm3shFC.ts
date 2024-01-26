export default {
    name: 'Infinite Heart of Glass',
    mode: WebGLRenderingContext.LINE_STRIP,
    num: 256,
    text: `
    void main() {
  
        float t = time + 5.0;
        
        float sndx = texture2D(sound, vec2(0.4, 0.4)).a;
        float sndy = texture2D(sound, vec2(0.2, 0.2)).a;
        
        float xo = vertexId / 128.0;
        float yo = vertexId / 64.0;
         
        vec2 xy = vec2(cos(xo * t) * 2.0 * sndx, 
                       sin(yo * t) * 2.0 * sndy * sndx);
        xy *= 0.8;
      
        
        gl_Position = vec4(xy, 0, 1);
      
        v_color = vec4(vec3(clamp(xy.y + 0.8, 0.0, 1.0), 
                            clamp(xy.x + 0.7, 0.0, 1.0), 
                            clamp(xy.y + 0.8, 0.0, 1.0)), 1.0);
      }`,
};