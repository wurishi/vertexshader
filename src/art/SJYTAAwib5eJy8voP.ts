export default {
    name: '412b synchrony',
    mode: WebGLRenderingContext.TRIANGLES,
    num: 6000,
    text: `
    vec3 f(vec3 c){c=vec3(c.x,clamp(c.yz,0.,1.));vec4 K=vec4(1.,2./3.,1./3.,3.);vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www);return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y);}void main(){float c=floor(vertexCount/6.);float i=floor(vertexId/6.);float j=mod(vertexId,6.);gl_Position=vec4(i/c*2.-1.+(mod(j,2.)>0.?2./c*9.:0.),j>1.&&j<5.?sin(i/c+mod(i,9.)+time):0.,-i/c,1);v_color=vec4(f(vec3(c/i+time,1,1)),.3);v_color.rgb*=.3}`,
};