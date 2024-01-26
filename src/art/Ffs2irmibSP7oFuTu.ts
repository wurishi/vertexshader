export default {
    name: '124b sin city',
    mode: WebGLRenderingContext.TRIANGLES,
    num: 3840,
    text: `
    void main(){gl_Position=vec4(vertexId/vertexCount*2.-1.,-tan(mod(vertexId,99.)*vertexId+time)/9.,0,1);v_color=vec4(1,1,1,1)}`,
};