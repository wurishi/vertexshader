export default {
    name: 'Bouncy Music Lines',
    mode: WebGLRenderingContext.POINTS,
    num: 5000,
    text: `
    // Just a bunch of lines bouncing to music
//

// I'm still learning and "borrowing" many techniques from other shaders

// hsv2rgb borrowed from gman shaders
vec3 hsv2rgb(vec3 c) {
  c = vec3(c.x, clamp(c.yz, 0.0, 1.0));
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main()
{
  float ROWS = 5.;
  float verts_per_row = vertexCount / ROWS;
  float row = floor(vertexId / verts_per_row);
  float row_per = row / (ROWS-1.);
  float vertex_per = mod(vertexId, verts_per_row) / verts_per_row;
  float x = vertex_per*2.0 - 1.0 + row_per * 0.5;
  float y = texture2D(sound,vec2(vertex_per,row_per)).a + (row_per) - 1.;
  gl_PointSize = 10.0;
  gl_Position = vec4(x,y,0,1);
  v_color = mix(vec4(hsv2rgb(vec3(0.25, fract(time+row_per), 1.)), 1.-row_per), background, row_per - 0.2);
}
`,
};