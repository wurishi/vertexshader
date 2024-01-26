export default {
    name: 'K Circle',
    mode: WebGLRenderingContext.POINTS,
    num: 38360,
    text: `
    // Spiral Circle thingy
// Testing music sync
// K Machine ready
// now ok


#define parameter0 0.2//KParameter0 0.1>>1.5
#define parameter1 1.9//KParameter1 1.0>>2.0
#define parameter2 2.0//KParameter2 2.0>>5.0
#define parameter3 5.0//KParameter3 5.0>>10.0
#define parameter4 3.0//KParameter4 1.0>>5.0

void main () {
  float v = vertexId * 200. * sin(time/20000.);
  
  float spiral = 1. - parameter1 * vertexId / (vertexCount+vertexCount);
  
  float grid =   floor(vertexCount / 1000.);
  float step100 = floor (100. * vertexId / vertexCount); 
  float sndFactor = texture2D(sound, vec2(mod(step100, 4.), step100/400.)).a;
  float scale = parameter0 * (parameter3 * sndFactor);
  
  float xoff = sndFactor * (sin(time/1.)/2.) * 0.5;
  float yoff = sndFactor * (sin(time/1.)/2.) * 0.5;
  
  float y = sin(v / (50. * (2. + sin(time * 2000.)))) * spiral;
  float x = cos(v / (50. * (2. + sin(time * 2000.)))) * spiral;
  
  float ux = x * scale - xoff;
  float uy = y * scale - yoff;
  
  gl_Position  = vec4(ux, uy, 0, 1);
  gl_PointSize =  sndFactor * parameter4;//v / (sndFactor *100000.) ;// grid;

  v_color = vec4(sndFactor * parameter2, sin(1./spiral), 1./spiral, 1);
}`,
};