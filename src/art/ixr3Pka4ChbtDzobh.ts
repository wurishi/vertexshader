export default {
    name: 'Spiral-Spring',
    mode: WebGLRenderingContext.TRIANGLE_STRIP,
    num: 16384,
    text: `// 
    //
    //  Move the mouse
    //
    
    vec3 hsv2rgb(vec3 c) {
      c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    void main() {
      float tm  = sin(time) * 20.;
      vec2 aspect = vec2(1, resolution.x / resolution.y);
      float t = (vertexId*2.0+mod(vertexId,2.0))*0.01;
      float phase = -tm+mod(vertexId,2.0);
      float a = 0.5;
      float b = 0.3063489;
      float x = a * exp(b*t*0.2)*cos(t+phase)*0.015;
      float y = a * exp(b*t*0.2)*sin(t+phase)*0.015;
      vec4 m = texture2D(touch, vec2(0., vertexId * 0.00005));
      vec2 xy = vec2(x, y);
      gl_Position = vec4(xy * aspect + m.xy, 0, 1);
    
      
      float hue = (floor(vertexId * -.005) * 0.5 - time * 0.01);
      float sat = 1.;
      float val = 0.5+mod(vertexId,2.0)*0.5;
      v_color = vec4(hsv2rgb(vec3(hue, sat, val)), 1);
    }`,
};