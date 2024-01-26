export default {
    name: 'tuto 1',
    mode: WebGLRenderingContext.POINTS,
    num: 837,
    text: `
    void main() {
        // float a = vertexId /20.;
         float x = mod(vertexId, 10.);
         float y = floor(vertexId /10.);
         float u = x/10.;
         float v = y/10.;
         float ucorr = (u*2.)-1.;
         float vcorr = (v*2.)-1.;
           
         gl_Position = vec4(ucorr, vcorr, 0, 1);
         gl_PointSize = 10.;
         v_color = vec4(1, 0, 0, 1);
         
       }
       `,
};