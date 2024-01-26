export default {
    name: '119b matrix rain',
    mode: WebGLRenderingContext.TRIANGLES,
    num: 999,
    text: `
    void main(){gl_Position=vec4(vertexId/vertexCount*2.-1.,sin(mod(vertexId,9.)*vertexId+time),0,1);v_color=vec4(0,1,0,1)}`,
};
