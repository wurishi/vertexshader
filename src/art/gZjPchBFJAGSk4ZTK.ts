export default {
    name: 'Simple Music Line',
    mode: WebGLRenderingContext.LINE_STRIP,
    num: 50,
    text: `
    // Simple Line which responds to music
// This is intended to be super simple, to learn how to use VertexShaderArt
// If you're just beginning please feel free to experiment with this or use as a starting point for your shaders

void main()
{
  // vertex_percent is vertexId mapped to [0..1]
  float vertex_percent = vertexId / (vertexCount-1.0); // We use -1.0 to ensure a point exists at the end
  float x = vertex_percent*2.0 - 1.0; // Mapping vertex_percent [0..1] to X screen range, which is [-1..1]
  
  // sound texture has (amplitude, history) for (u,v). 
  // u range is [0..1]: 0 is lowest bass, 1 is highest treble
  // v range is [0..1]: 0 is right now, 1 is 4 seconds in the past
  // It is all in the alpha channel of the sound texture
  
  // Set y position to amplitude in [0..1] range.
  // Y will be 1.0 at peak amplitude (top of screen) and 0.0 for silence (middle of screen)
  float y = texture2D(sound,vec2(vertex_percent,0.0)).a; 
  
  gl_PointSize = 10.0; // Set point size in case want to render points instead of line, not used in line
  gl_Position = vec4(x,y,0,1); // simply plot onto screen space at z=0 with opacity=1, screen range is [-1..1] for both x and y
  v_color = vec4(1.0); // Just setting to the color white with opacity=1
}

//===================================================================================
// ** Experiment **
// Try setting primitive to "POINTS" in the drop down
// Type a new number of verts in the text box at top. Try something small like "10".
// Keep adding zeros to 100, 1000, 10000 and watch sampling fidelity increase.
//===================================================================================


// Sometimes looking at code is easier without comments
// Here it is without my clutter.
// You can click "+" at the top of this window to create a new clean shader.
// Then cut at paste this code into that shader
// Don't forget to get a song from SoundCloud to paste into the URL in top right.
//
/*

void main()
{
  float vertex_per = vertexId / (vertexCount-1.0);
  float x = vertex_per*2.0 - 1.0;
  float y = texture2D(sound,vec2(vertex_per,0.0)).a;
  gl_PointSize = 10.0;
  gl_Position = vec4(x,y,0,1);
  v_color = vec4(1.0);
}

*/
`,
};