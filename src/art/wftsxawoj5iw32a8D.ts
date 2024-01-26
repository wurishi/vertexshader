export default {
    name: 'Cs230',
    mode: WebGLRenderingContext.LINES,
    num: 10000,
    text: `
    
void main() 
{
  	float value = vertexId*10.0;
    
	float x =mouse.x;
	float y = mouse.y;
  
 	float snd = texture2D(sound, vec2(0, 0)).a;
  	gl_Position = vec4(cos(value), sin(value), 0, abs(snd*2.0));
  
  	gl_PointSize = 50.0;
  
  	v_color = vec4(cos(x), sin(y), tan(x*y), 1);
}

  `,
};