export default {
    name: 'Line Of Sound',
    mode: WebGLRenderingContext.LINE_STRIP,
    num: 5000,
    text: `
    void main () {
        vec3 pos = vec3((vertexId/vertexCount), 0.0, 0.0);
        pos.y = (texture2D(volume, vec2(0.0, pos.x)).a-0.3)*1.6;
        pos.x = (pos.x-0.5)*2.0;
        vec3 clr = vec3(pos.x, pos.y, -pos.x)+0.5;
        
        gl_PointSize = 12.0;
        gl_Position = vec4(pos, 1.0);
        v_color = vec4(clr, 1.0);
      }`,
};