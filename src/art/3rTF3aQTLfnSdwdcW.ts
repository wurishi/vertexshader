export default {
    name: 'unnamed',
    mode: WebGLRenderingContext.POINTS,
    num: 100,
    bg: 0x0000ff,
    text: `
    void main(){
        float across = 10.;
        
        float x = mod(vertexId, across );
        float y = floor(vertexId / across);
        
        float u = x / (across -1.);
        float v = y / (across -1.);
        
        float ux = u * 2. -1.;
        float vy = v * 2. -1.;
        
        
        gl_Position = vec4(ux,vy,0,1);
        
        gl_PointSize = 10.0;
        
        v_color = vec4(1,0,0,1);
        
        
      }`,
};