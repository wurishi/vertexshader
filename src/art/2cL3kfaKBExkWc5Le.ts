export default {
    name: "baby's first vertex shader",
    mode: WebGLRenderingContext.POINTS,
    num: 240,
    text: `
    #define PI radians(180.)
#define GAMMA 0.454545


float soundIntensity(float frq){
	return texture2D(sound, vec2(frq, 0)).a;
}

float meanIntensity(){
  	const float samples = 50.;
 	float intensity;
  for(float i = 0.; i < samples; i+=1./samples){
    	intensity += soundIntensity(i);
  }
	return intensity/samples;
}

vec3 getVertexColor(){
	float ratio = vertexId/vertexCount;
  	float intensity = soundIntensity(ratio);
  	return vec3(0.5, 0., 0.5);
}

void main(){
  	float aspect = resolution.x / resolution.y;
	float vertexRatio = vertexId/vertexCount;
    float vertexRadians = vertexRatio * PI * 2.;
  	
    float x = cos(vertexRadians);
    float y = sin(vertexRadians);
    float z = vertexRatio;
  
    gl_Position = vec4(
      x,
      y*aspect,
      1. - z,
      3. - meanIntensity()
    );
    
  	v_color = vec4(getVertexColor(), 0.5);
  
  	float frequencyScale = 6.;
  	gl_PointSize = pow(soundIntensity(0.075*pow(vertexRatio+0.5,frequencyScale))+1.1, 7.);

}`,
};