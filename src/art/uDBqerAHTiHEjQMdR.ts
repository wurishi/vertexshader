export default {
    name: 'otbs',
    mode: WebGLRenderingContext.POINTS,
    num: 1000,
    text: `
#define PI radians(180.0)

void main() {
  float t = vertexId / vertexCount + fract(time * 8.) * -0.0025;
  float sideId = mod(vertexId, 2.);
  float twist = vertexCount / 200.0;
  
  t = cos(t * PI * .5);

  float m = t * PI * twist + sideId * PI;
  float r = t * .75;
  
  m += mod(time / vertexCount, 1.);

  float x = r * cos(m);
  float z = r * sin(m);

  float aspect = resolution.x / resolution.y;
  gl_Position = vec4(
      vec3(
          x / aspect, 
          t * -2. + 1., 
          z) * 0.8,
      1);
  gl_PointSize = 3.0;
  v_color.rgb = mix(vec3(1,0,0), vec3(0,1,1), sideId); 
  v_color.a = mix(.5, 1., sin(m) * .5 * .5);
  v_color.a = mix(.2, 1., step(0., -sin(m)));
  v_color.rgb *= v_color.a;
}
`,
};
