export default {
    name: 'Waves',
    mode: WebGLRenderingContext.POINTS,
    num: 6867,
    text: `
    


void main() {

  
  
    float across = floor(sqrt(vertexCount));
    float down =  floor(vertexCount/ across);
    float x = mod(vertexId,across);
    float y = floor(vertexId/across);
    
    float x1 = x/(across - 1.);
    float y1 = y/(across - 1.);
    
    float x2 = x1 * 2. -1.;
    float y2 = y1 * 2. -1.;
    
    float xSineOff = sin(time + y*0.2)*0.1 ;
    float ySineOff = sin(time + x*0.3)*0.1 ;
  
    
    float x3 = x2 + xSineOff ;
    float y3 = y2 + ySineOff;
    vec2 xy = vec2(x3,y3);
    
  
    
    gl_Position = vec4(xy,0,0.8);
   
    float soff = sin(time);
    
    float verticalSize = resolution.y/down +soff;
    float horizontalSize = resolution.x/across +soff;
    
  
  
    
    if(verticalSize<horizontalSize){
      gl_PointSize = verticalSize/2.;
    }else{
        gl_PointSize = resolution.x/across/2.;  
    }
    
    v_color = vec4(1,0,0,1);
  
  }`,
};