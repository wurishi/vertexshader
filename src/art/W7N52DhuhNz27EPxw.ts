export default {
    name: 'Ders 1',
    mode: WebGLRenderingContext.POINTS,
    num: 72900,
    text: `
    vec3 hsv2rgb(vec3 c) {
        c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
      
      void main() {
        float kenarKat = (abs(sin(time * 0.1)) * 0.1 + 0.8);
        
        float kenar = floor(sqrt(vertexCount)) * kenarKat;
        
        float x = floor(vertexId / kenar);
        float y = mod( vertexId, kenar);
        
        float u = x / (kenar - 1.0) * abs(sin(time + y * 0.1));
        float v = y / (kenar - 1.0) + cos(x * 0.05);
        
        float ux = (u - 0.5) * 1.1 * (sin(4.0 * time + v) * 0.3 + 0.6);
        float vy = (v - 0.5) * 2.1;
        
        gl_PointSize = 45.0 *  10.0 / kenar;
        
        gl_Position = vec4(ux,vy,0.0,1.0);
        
        vec3 hsv = vec3(u * sin(time * 0.3), abs(sin(time * vy * ux + u)), sin(time*v));
        
        v_color = vec4(hsv2rgb(hsv),1.0);
      }`,
};