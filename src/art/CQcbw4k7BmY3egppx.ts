export default {
    name: 'funk',
    mode: WebGLRenderingContext.TRIANGLE_FAN,
    num: 17096,
    text: `
    #define PI radians(180.)
#define NUM_SEGMENTS 2.0
#define NUM_POINTS (NUM_SEGMENTS * 2.0)
#define STEP 1.0

void main() {
  
  float point = mod(floor(vertexId / 2.0) + mod(vertexId, 2.0) * STEP, NUM_SEGMENTS);
  float count = floor(vertexId / NUM_POINTS);
  float offset = count * sin(time * 0.01) + 5.0;

  float ss = texture2D(sound,vec2(point,point)).r;

  
  float angle = point * PI * 2.0 / NUM_SEGMENTS + offset;
  float radius = pow(count * 0.00014, 1.0-ss);
  float c = cos(angle + time) * radius;
  float s = sin(angle + time) * radius;
  float orbitAngle =  pow(count * 0.025, 0.8);
  float innerRadius = pow(count * 0.0005, 1.2-time*0.01);
  float oC = cos(orbitAngle + count * 0.0001) * innerRadius;
  float oS = sin(orbitAngle + count * 0.0001) * innerRadius;

  vec2 aspect = vec2(1, resolution.x / resolution.y);
  vec2 xy = vec2(
      (oC + c)*time*0.01*cos(time*0.1+point*10.5),
      (oS + s)*time*0.01*sin(time*0.1+point*10.5));
  gl_Position = vec4(xy * aspect + mouse * 0.1, 0, 10.0 - 9.*texture2D(sound,vec2(cos(time)*xy.x*0.1,sin(time)*xy.y*0.1)).r);

  float b = 0.5 - pow(sin(count * 0.4) * 0.4 + 0.5, 1.0);
  b /= time*0.00001*1.2*abs(cos(time*10.2)*0.5);mix(0.0, 0.7, b);
  v_color = vec4(b+texture2D(sound,vec2(cos(time)*xy.x*0.1,sin(time)*xy.y*0.1)).r, b+texture2D(sound,vec2(cos(time)*xy.x*0.1,sin(time)*xy.y*0.1)).r, b+texture2D(sound,vec2(cos(time)*xy.x*0.1,sin(time)*xy.y*0.1)).r, 1);
}`,
};