varying vec2 vUv;
attribute vec2 reference;
uniform sampler2D positionTexture;
void main()
{
    vUv = reference;
    vec3 pos = texture(positionTexture, reference).xyz;
    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    gl_PointSize = 20. * (1. / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}