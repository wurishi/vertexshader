export default {
    name: 'point cloud vs spheres',
    mode: WebGLRenderingContext.POINTS,
    num: 50000,
    text: `
    /*
   point cloud vs spheres by Kabuto

   Recreated this well-known demo effect. A bit tricky without being able to store history for points, so it's just computed again and again for each render pass
*/

vec3 posf2(float t, float i) {
	return vec3(
      sin(t+i*.953) +
      sin(t*1.311+i) +
      sin(t*1.4+i*1.53) +
      sin(t*1.84+i*.76),
      sin(t+i*.79553+2.1) +
      sin(t*1.311+i*1.1311+2.1) +
      sin(t*1.4+i*1.353-2.1) +
      sin(t*1.84+i*.476-2.1),
      sin(t+i*.5553-2.1) +
      sin(t*1.311+i*1.1-2.1) +
      sin(t*1.4+i*1.23+2.1) +
      sin(t*1.84+i*.36+2.1)
	)*.2;
}

vec3 posf0(float t) {
  return posf2(t,-1.)*3.5;
}

vec3 posf(float t, float i) {
  return posf2(t*.3,i) + posf0(t);
}

vec3 push(float t, float i, vec3 ofs, float lerpEnd) {
  vec3 pos = posf(t,i)+ofs;
  
  vec3 posf = fract(pos+.5)-.5;
  
  float l = length(posf)*2.;
  return (- posf + posf/l)*(1.-smoothstep(lerpEnd,1.,l));
}

void main() {
  // more or less random movement
  float t = time*.20;
  float i = vertexId+sin(vertexId)*100.;

  vec3 pos = posf(t,i);
  vec3 ofs = vec3(0);
  for (float f = -10.; f < 0.; f++) {
	  ofs += push(t+f*.05,i,ofs,2.-exp(-f*.1));
  }
  ofs += push(t,i,ofs,.999);
  
  pos -= posf0(t);
  
  pos += ofs;
  
  
  pos.yz *= mat2(.8,.6,-.6,.8);
  pos.xz *= mat2(.8,.6,-.6,.8);
  
  pos *= 1.;
  

  pos.z += .7;
  
  pos.xy *= .6/pos.z;
  
  gl_Position = vec4(pos.x, pos.y*resolution.x/resolution.y, pos.z*.1, 1);
  gl_PointSize = 1./pos.z;

  v_color = vec4(abs(ofs/max(length(ofs),1e-9))*.3+.7,1);
}`,
};