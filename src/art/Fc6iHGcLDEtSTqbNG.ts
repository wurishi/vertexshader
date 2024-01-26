export default {
    name: 'tm-grid',
    mode: WebGLRenderingContext.LINES,
    num: 44009,
    text: `
    /* 

⬆ click [UI] and pick [⚪] then move the [🖱] mouse






























































*/


#define PI radians(180.0)

void main() {
  float numQuads = floor(vertexCount / 4.);
  float quadId = floor(vertexId / 4.);
  float down = floor(sqrt(numQuads));
  float across = floor(numQuads / down);
  
  float gx = mod(quadId, across);
  float gy = floor(quadId / across);
  
  float vId = mod(vertexId, 4.);
  
  float x = gx + mod(vId, 2.) - step(3., vId);
  float y = gy + step(3., vId);

  vec2 aspect = vec2(1, resolution.x / resolution.y);
  vec2 xy = vec2(x, y) / vec2(across, down) * 2. - 1.;
  
  vec2 sp = xy  * 1.1;
  
  const int count = 60;
  for (int i = 0; i < count; ++i) {
    float iv = 1. - float(i) / float(count - 1);
    float hist = (float(i) + 0.5) / soundRes.y;
    vec2 m = texture2D(touch, vec2(0, hist)).xy;
    vec2 dm = m - sp;
    float dist = length(dm);
    float effect = mix(1., 0., clamp(dist * 5., 0., 1.));
    sp = sp - dm * pow(abs(effect), 2.5) * 1. * pow(iv, 2.);
  }
    
  float ang = fract(time * 0.1 + abs(atan(sp.x, sp.y) / PI));
  float rad = length(sp);
  float snd = texture2D(sound, vec2(mix(0.001, 0.030, ang), rad * 0.2)).a;
  
  sp += pow(snd, 5.) * 0.025;
  
  
  gl_Position = vec4(sp, 0, 1);
  
  float pump = step(mix(1., 0.8, ang), snd);

  v_color = vec4(vec3(mix(0.1, 1., pow(snd, 5.))), 1);
  
  v_color = mix(v_color, vec4(1,0,0,1), pump);
}`,
};