export default {
    name: 'color whip',
    mode: WebGLRenderingContext.LINE_STRIP,
    num: 64,
    text: `
    void main() {  
        gl_PointSize = 5.0;
        
        v_color = vec4(
      
          abs(sin(vertexId * 0.1 - time * 8.0)),
          abs(sin(vertexId * 0.1 - time * 8.0 + 2.09)),
          abs(sin(vertexId * 0.1 - time * 8.0 + 4.18879020479)),
          1.0);
        
        gl_Position.x = sin(time * 2.0 - vertexId / 8.0) * vertexId / 64.0;
        gl_Position.y = cos(time * 2.0 - vertexId / 16.0) * vertexId / 64.0;
        gl_Position.z = 0.0;
        gl_Position[3] = 1.0;
      }`,
};