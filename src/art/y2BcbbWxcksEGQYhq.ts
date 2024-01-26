export default {
    name: 'sleep',
    mode: WebGLRenderingContext.POINTS,
    num: 5000,
    text: `
    void main()
{
  float x = vertexId * 0.025;
  x = mod(x,2.0);
  x-= 1.0;
  float y = texture2D(sound,vec2(pow(vertexId/soundRes.x,2.0)*0.25,0.0)).a*0.5;
  y*= 1.0 + vertexId * 0.025;
  float instantY = y;
  int smoothCount = 20;
  for ( int i=0; i <= 20; i++)
  {
    y+=texture2D(sound,vec2(pow(vertexId/soundRes.x,2.0),float(i)/float(smoothCount)/64.0)).a;
  }
  y/=float(smoothCount+1);
  float lum = clamp(instantY-y,0.0,0.5)*0.1;

  y = pow(y,2.0)-0.7;
  gl_Position = vec4(x,y,0,1);
  gl_PointSize = 44.0;
  instantY = pow(instantY,0.5);
  v_color = vec4((0.2+lum)*instantY,(0.2+lum+vertexId*0.0005)*instantY,(0.8+lum)*instantY,instantY);
}
`,
};