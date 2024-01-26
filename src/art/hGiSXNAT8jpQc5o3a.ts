export default {
    name: 'the flames of sleng teng',
    mode: WebGLRenderingContext.TRIANGLE_STRIP,
    num: 62776,
    text: `
    
vec3 hsv2rgb(vec3 c) {
    c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  void main() {
    float ltime = time*0.2;
    float NUM_SEGMENTS = 512.0;
    float NUM_POINTS = (NUM_SEGMENTS * 2.0);
    float STEP = 0.5+0.4*cos(ltime);
    float NUM_LINES_DOWN = 512.0+180.*cos(ltime);
  
    // produces 0,1, 1,2, 2,3, ...
    float point = floor(mod(vertexId, NUM_POINTS) / 2.0) + mod(vertexId, 2.0) * STEP;
    // line count
    float count = floor(vertexId / NUM_POINTS);
  
    float u = point / NUM_SEGMENTS;    // 0 <-> 1 across line
    float v = count / NUM_LINES_DOWN*15.0-ltime*0.1;  // 0 <-> 1 by line
    float invV = 1.0 - v;
  
    // Only use the left most 1/4th of the sound texture
    // because there's no action on the right
    float historyX = u * 0.35;
    // Match each line to a specific row in the sound texture
    float historyV = (v * NUM_LINES_DOWN + 0.5) / soundRes.y;
    float snd = texture2D(sound, vec2(historyX, historyV)).a;
  
    float x = u * 2.0 - 1.0+0.1*cos(v+point*snd*0.1);
    float y = v * 2.0 - 1.0+0.1*sin(u+point*snd*0.1);
    vec2 xy = vec2(
        x * mix(0.0, 14.0, invV+0.3*cos(ltime*0.5)),
        y + pow(snd, 2.0) * 4.0) / (v + 0.5);
    gl_Position = vec4(xy * 0.5, 0, 2);
  
    float hue = u;
    float sat = invV;
    float val = invV;
    v_color = vec4(hsv2rgb(vec3(hue, sat, val)), 1);
  }`,
};