export default {
    name: 'Simple line music extended',
    mode: WebGLRenderingContext.POINTS,
    num: 800,
    text: `
    // Simple Line which responds to music
// This is intended to be super simple, to learn how to use VertexShaderArt
// If you're just beginning please feel free to experiment with this or use as a starting point for your shaders

void main()
{
  // vertex_percent is vertexId mapped to [0..1]
  float nb_circles = 10.0;
  float nbpointspercircle = vertexCount/nb_circles;
  float vertex_percent = (vertexId) / (vertexCount-1.0); // We use -1.0 to ensure a point exists at the end
  float x = (vertex_percent*2.0-1.0)*0.7; // Mapping vertex_percent [0..1] to X screen range, which is [-1..1]
  
  // sound texture has (amplitude, history) for (u,v). 
  // u range is [0..1]: 0 is lowest bass, 1 is highest treble
  // v range is [0..1]: 0 is right now, 1 is 4 seconds in the past
  // It is all in the alpha channel of the sound texture
  
  // Set y position to amplitude in [0..1] range.
  // Y will be 1.0 at peak amplitude (top of screen) and 0.0 for silence (middle of screen)
  float circ_num= mod(vertexId, nb_circles)/nb_circles;
  float y = -0.5+2.0*texture2D(sound,vec2(circ_num,0.0)).a*0.5; 
  
  float r = 0.3;
  float posx = (0.01*sin(r*time)+r)*(circ_num+1.0) * cos(vertex_percent*2.0*3.14+0.05*time)*0.8*((y*2.0)-1.0);
  float posy = (0.01*sin(r*time)+r)*(circ_num+1.0) * sin(vertex_percent*2.0*3.14+0.0501*time)*0.8*((y*2.0)-1.0);
 
  
  gl_PointSize = 5.0; // Set point size in case want to render points instead of line, not used in line
  gl_Position = vec4(posx,posy,0,1); // simply plot onto screen space at z=0 with opacity=1, screen range is [-1..1] for both x and y
  v_color = vec4(sin(time)*sin(time), y+1.0, circ_num, 1.0);
  vec4 aa = background;
} 

`,
};