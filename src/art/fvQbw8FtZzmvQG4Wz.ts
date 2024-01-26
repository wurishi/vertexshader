export default {
    name: 'Sound Texture',
    mode: WebGLRenderingContext.POINTS,
    num: 100000,
    text: `
    void main() {  
        float aspect = resolution.x / resolution.y;
        vec2 dim =  floor(vec2(sqrt(vertexCount*aspect) ,sqrt(vertexCount/aspect)));
        vec2 p = vec2(mod(vertexId, dim.x), mod(floor(vertexId/ dim.x),dim.y));
        p /= dim;
        p = p * 2.0 - 1.0;
        gl_Position = vec4(p, 0.0, 1.0);  
        gl_PointSize=resolution.y / dim.y;
        //p.x *= aspect;
        vec3 col = texture2D(sound, p * 0.5 + 0.5).rgb;
        v_color = vec4(col, 1.0);
      }`,
};