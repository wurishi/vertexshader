export default {
    name: '3D Sine Wave',
    mode: WebGLRenderingContext.POINTS,
    num: 50000,
    text: `
    void main () {
        vec4 pos = vec4(-1.0, sin(2.0*time + vertexId * 0.005)-0.5 * 0.8, 0.0, 1.0);
        gl_PointSize = 15.0;
        gl_Position = pos + vertexId*0.0006;
        v_color = vec4(pos.x, pos.y, -pos.y, 1.0) + 0.5;
      }`,
};