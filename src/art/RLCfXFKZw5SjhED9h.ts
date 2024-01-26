export default {
    name: 'waves',
    mode: WebGLRenderingContext.POINTS,
    num: 10000,
    text: `
    void main() {
        float across = floor(sqrt(vertexCount));
        float x = mod(vertexId, across) / across;
        float y = floor(vertexId / across) / across;
        x = x* 3. - 1.5;
        y = y* 3. - 1.5;  
        
        float u = x + sin(time  * y) * .02;
        float v = y + cos(time  * x) * 4.;  
        
        gl_Position = vec4(u, v, 0, 1);
        gl_PointSize = 300. / across;
      
        v_color = vec4(0, 1, 1, 1);
      }`,
};