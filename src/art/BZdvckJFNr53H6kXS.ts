export default {
    name: 'john_1',
    mode: WebGLRenderingContext.POINTS,
    num: 100000,
    text: `
    void main() {
        float down = floor(sqrt(vertexCount));
        float across = floor(vertexCount / down);
        
        float x = mod(vertexId, across);
        float y = floor(vertexId / across);
        
        float u = x / (across - 1.);
        float v = y / (across - 1.);
        
        float ux = u * 2. - 1.;
        float uy = v * 2. - 1.;
        
        gl_PointSize = 10.;
        gl_PointSize *= 20. / across;
        
       gl_Position = vec4(ux,uy,0,1);
        
        v_color = vec4(1,0,0,1);
      }
      `,
};