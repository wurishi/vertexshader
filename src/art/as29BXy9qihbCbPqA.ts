export default {
    name: 'Lonely Rolling Star',
    mode: WebGLRenderingContext.POINTS,
    num: 256,
    text: `
    #define PI radians(180.)

float soundIntensity(float frq){
	return texture2D(sound, vec2(frq, 0)).a;
}

float soundIntensityDelta(float frq, float timeOffset){
	float currentIntensity = soundIntensity(frq); 
  	return currentIntensity - texture2D(sound, vec2(frq, timeOffset)).a;
}

float meanIntensity(){
  	const float samples = 25.;
 	float intensity;
  
    for(float i = 0.; i < samples; i+=1./samples){
		intensity += soundIntensity(i);
  	}
  
	return intensity/samples;
}

float meanIntensityDelta(float frq, float range){
  	const float samples = 25.;
 	float intensity = 1.;
 	
  	for(float i = 0.; i < samples; i+=1./samples){
    	intensity += abs(soundIntensityDelta(frq, i*range));
  	}
  
	return intensity/samples;
}

vec3 getVertexColor(){
	float ratio = (vertexId/vertexCount);
  	float intensity = soundIntensity(ratio);
  
  	return vec3(
        clamp(soundIntensity(ratio)/1.5, 0.0, 0.5),
        clamp(0.4 + soundIntensity(ratio)*0.5 - meanIntensityDelta(ratio, 0.015)/4., 0.0, 0.4),
        0.5
    );
}

void main(){
  	float aspect = resolution.x / resolution.y;
  	float timeMultiplier = 0.33;
  	float perspective = 0.66;
  
	float vertexRatio = (vertexId+1.)/vertexCount;
    float vertexRadians = vertexRatio * 2.;
  
    float x = cos(vertexRadians*PI-time*timeMultiplier);
    float y = sin(vertexRadians*PI-time*timeMultiplier) * perspective;
    float z = soundIntensity((vertexId/vertexCount)) * perspective;
  
    gl_Position = vec4(
        x,
        y*aspect,
        1. - z,
        2.5 - z - meanIntensity()
    );
    
  	v_color = vec4(getVertexColor(), 0.5);
  
  	gl_PointSize = pow(soundIntensity((vertexId/vertexCount))+1.5, 5.);
      

}`,
};