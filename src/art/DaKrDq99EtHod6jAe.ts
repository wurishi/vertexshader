export default {
    name: 'compare 2 hash',
    mode: WebGLRenderingContext.POINTS,
    num: 11804,
    text: `
//test for the hash function used @gman
float hash(float p) {
	vec2 p2 = fract(vec2(p * 5.3983, p * 5.4427));
    p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
	return fract(p2.x * p2.y * 95.4337);
}
 
//https://www.shadertoy.com/view/4djSRW
float hashOld12(vec2 p)
{
    // Two typical hashes...
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    
    // This one is better, but it still stretches out quite quickly...
    // But it's really quite bad on my Mac(!)
    //return fract(sin(dot(p, vec2(1.0,113.0)))*43758.5453123);

}

vec3 hashOld33( vec3 p )
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
			  dot(p,vec3(269.5,183.3,246.1)),
			  dot(p,vec3(113.5,271.9,124.6)));

	return fract(sin(p)*43758.5453123);
}




float w2NDC(float v) {
  return v * 2. - 1.;
}

void main()
{  
   float d = floor(sqrt(vertexCount)) ;
   float a = floor(vertexCount / d) ; 
   float x = mod(vertexId , a ) ;
   float y = floor(vertexId / a ) ; 

   float u = w2NDC(x / (a -1.)) ; //in NDC 
   float v = w2NDC(y / (a -1.)) ; //in NDC 
   float aspect = resolution.x/ resolution.y ;
  
   if(vertexId < 1000.)
   {
     gl_Position = vec4( 0.  , w2NDC(vertexId / aspect * 0.01 ) , 0.  , 1. ) ; 
     gl_PointSize = 20. ; 
     v_color = vec4(1. , 0.02 , 0.3 , 1.) ; 
   }
  else if(vertexId < 3000. && vertexId > 1000.  )
  {
	float ux = w2NDC(hashOld12(vec2(vertexId * u))) ;
    if(ux < 0. )
    {  
      gl_Position = vec4(ux, w2NDC(hashOld12(vec2(vertexId * v))) * v, 0. , 1. );

      gl_PointSize = 5.; 
      v_color = vec4(1.) ;
    }
    
    ux =  w2NDC(hashOld33(vec3(vertexId * u)).x );  
    if(ux > 0. )
    {
       gl_Position = vec4( w2NDC(hashOld33(vec3(vertexId * u)).x ), w2NDC(hashOld12(vec2(vertexId * v))) * v, 0. , 1. ) * 1.;
      gl_PointSize = 5.; 
      v_color = vec4(1.) ;
    }
  }
}`,
};