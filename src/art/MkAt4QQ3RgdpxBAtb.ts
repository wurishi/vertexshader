export default {
    name: 'fuzzies',
    mode: WebGLRenderingContext.POINTS,
    num: 85351,
    text: `
    #define PI radians(180.)
#define TAU radians(360.)

float rand(float n) {
  return fract(sin(n) * 1473.5453123 + cos(n*0.9635) * 647.473261);
}

vec2 rect(float i) {
  float a = i * 4.;
  float s = floor(a);
  float si = mod(a, 1.) * 2. - 1.;
  vec2 side;
  if(s == 0.)      side = vec2(si, -1.);
  else if(s == 1.) side = vec2(1., si);
  else if(s == 2.) side = vec2(-si, 1.);
  else if(s == 3.) side = vec2(-1., -si);
  return side;
}

vec2 diamond(float i) {
  float a = i * 4.;
  float s = floor(a);
  float si = mod(a, 1.);
  float comsi = 1.0 - si;
  vec2 side;
  if(s == 0.)      side = vec2(si, comsi);
  else if(s == 1.) side = vec2(-comsi, si);
  else if(s == 2.) side = vec2(-si, -comsi);
  else if(s == 3.) side = vec2(comsi, -si);
  return side;
}

vec2 circle(float i) {
  return vec2(cos(i * TAU), sin(i * TAU));
}

void main() {
  float shapeCount = 3.;
  float i = vertexId / vertexCount * shapeCount;
  int shapeId = int(floor(i));
  float shape_i = fract(i);
  vec2 pos;
  
  float seed = vertexId + time;
  float u_noise = rand(seed);
  float v_noise = rand(seed+1.);
  float snd = texture2D(sound, vec2(shape_i / 1.33, shape_i)).a;
  float noiseAmp = (cos(time) / 2. + 0.5) * 0.8;
  float curve = pow(log(v_noise), sin(time)+1.);
  float noiseLevel = curve * snd;
  vec2 fudge = circle(u_noise) * noiseLevel * noiseAmp;
  
  float col = mix(1., 0.8, noiseLevel);
  float col2 = mix(0.9, 0.5, log(noiseLevel));
  
  if(shapeId == 0) {
    pos = circle(shape_i) * 0.5;
    v_color = vec4(col, col2, col2 / 2., 0);
  } else if (shapeId == 1) {
    pos = rect(shape_i) * 0.5;
    v_color = vec4(col2 / 2., col, col2, 0);
  } else if (shapeId == 2) {
    pos = diamond(shape_i) * 0.25;
    v_color = vec4(col2, col, col2 / 2., 0);
  }
  gl_PointSize = 1.;
  float aspect = resolution.y / resolution.x;
  mat4 perspective = mat4(aspect, 0., 0., 0.,
                          0., 1., 0., 0.,
                          0., 0., 1., 0.,
                          0., 0., 0., 1.);
  gl_Position = perspective * vec4(fudge + pos, noiseLevel, 1.);
}`,
};