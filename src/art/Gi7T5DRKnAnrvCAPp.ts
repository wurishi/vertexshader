export default {
    name: 'lesson1',
    mode: WebGLRenderingContext.POINTS,
    num: 100,
    text: `
    void main () {
        gl_Position = vec4(0,0,0,1);
        gl_PointSize = 10.0;
        
      
        v_color = vec4(1,0,0,1);
      }`,
};