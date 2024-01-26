export default {
    name: 'Lines Experiment 1',
    mode: WebGLRenderingContext.LINES,
    num: 1000,
    text: `
    // Created by Stephane Cuillerdier - Aiekick/2014
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Tuned via XShade (http://www.funparadigm.com/xshade/)

void main() 
{
	float astep = 3.14159 * 2.0 / 70.;
	
	float t = time * .3;
	
	float a = astep * float(vertexId) * t;
			
	vec2 d = a  * vec2(cos(a), sin(a));
	
	d /= 100.;
  
  	d.x *= resolution.y/resolution.x;
		
	gl_Position=vec4(d,0,1);
	
	v_color=vec4(1,1,1,1);
}`,
};