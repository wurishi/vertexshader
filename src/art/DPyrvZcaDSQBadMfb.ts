export default {
    name: 'unnamed',
    mode: WebGLRenderingContext.POINTS,
    num: 256,
    bg: 0x0000ff,
    text: `
    void main() 
    {
      
      
      gl_PointSize = 10.0;
      gl_Position = vec4(-0.5, -0.5, 0.0, 1.0);
      v_color = vec4(1.0, 0.0, 0.0, 1.0);
    }`,
};