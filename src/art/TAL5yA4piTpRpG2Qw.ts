export default {
    name: 'points,lines, and triangles. Its all pretty.',
    mode: WebGLRenderingContext.POINTS,
    num: 4000,
    bg: 0xffffff,
    text: `
    void main()
{
  float x = (vertexId/1000.0) - 1.0;
  float sign = mod( vertexId, 2.0 ) * 2.0 - 1.0;
  float y = x * sign; 
  gl_Position = vec4(x,y,0,1);
  gl_PointSize = (10.0 * x) * (x * 10.0) + 10.0;
  v_color = vec4(x * 10.0 * x * 2.0 + 1.0,
                 x*x*x*x,
                 x * x * 2.0 - 1.0,
                 1.0);
}
`,
};