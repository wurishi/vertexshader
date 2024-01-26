export default {
    name: 'spheres',
    mode: WebGLRenderingContext.POINTS,
    num: 24000,
    text: `
    #define PI 3.14159
#define N_SAMPLES 500.

vec3 lla2xyz(vec2 latlon, float rad) {
  float rxz = rad * cos(latlon.y);
  
  return vec3(
    rxz * cos(latlon.x),
    rad * sin(latlon.y),
    rxz * sin(latlon.x)
  );
}

vec3 aspect(vec3 p) {
  float ratio = resolution.y / resolution.x;
  if (ratio < 1.)
    return vec3(p.x * ratio, p.yz);
  else if (ratio > 1.)
    return vec3(p.x, p.y / ratio, p.z);
  return p;
}
vec3 project(vec3 p) { return aspect(vec3(p.xy/p.z, -p.z)); }

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 sphere_point(float i) {
  // golden ratio
  float phi = (sqrt(5.) + 1.) / 2. - 1.;
  // golden angle
  float ga = phi * 2. * PI;
  
  
  vec2 p = vec2(0.);
  if (i > N_SAMPLES)
    return p;
  
  p.x = ga * i;
  p.x /= 2. * PI;
  p.x = fract(p.x);
  p.x *= 2. * PI;
  
  p.y = asin(-1. + 2. * i / N_SAMPLES);
  return p;
}

void main () {
  vec3 centre = vec3(0., 0., -.5);
  
  float group = floor(vertexId / N_SAMPLES);
  float index = mod(vertexId, N_SAMPLES);
  float f = group / floor(vertexCount / N_SAMPLES);//rand(vec2(group, 7845.63541));
  
  float snd = pow(texture2D(sound, vec2(.05 + .25 * f, 0.)).a, 2.);
  for (int t = 0; t < 20; t++) {
    vec2 spos = vec2(
      .05 + .25 * f,
      float(t) / 10.
    );
    snd += pow(texture2D(sound, spos).a, 2.) / 20.;
  }
  
  vec2 group_ll = vec2(
    2. * rand(vec2(group, 27.68)) * PI,
    2. * rand(vec2(534.5, group)) * PI
  );
  group_ll.x -= time * .1;
  vec3 group_centre = lla2xyz(group_ll, .2 + .2 * rand(vec2(745.12, group)));
  vec2 ll = sphere_point(index);
  ll.x += time * f;
  vec3 pos = lla2xyz(ll, .05 + .1 * snd) + group_centre;
  pos += centre;
  
  
  gl_PointSize =  8. - abs(pos.z) * 10.;
  gl_Position = vec4(project(pos), 1.);
  
  
  v_color = vec4(
    .5 - .5 * cos(f * PI), .2,
    .5 + .5 * sin(f * PI), 1.);
}`,
};