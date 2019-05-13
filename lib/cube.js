function cube( size, yOffset, zOffset ) {
  var h = size * 0.5;
  
  var geometry = new THREE.BufferGeometry();
  var position = [
        -h, -h + yOffset, -h + zOffset,
        -h,  h + yOffset, -h + zOffset,
 
        -h,  h + yOffset, -h + zOffset,
         h,  h + yOffset, -h + zOffset,
 
         h,  h + yOffset, -h + zOffset,
         h, -h + yOffset, -h + zOffset,
 
         h, -h + yOffset, -h + zOffset,
        -h, -h + yOffset, -h + zOffset,
 
        -h, -h + yOffset,  h + zOffset,
        -h,  h + yOffset,  h + zOffset,
 
        -h,  h + yOffset,  h + zOffset,
         h,  h + yOffset,  h + zOffset,
 
         h,  h + yOffset,  h + zOffset,
         h, -h + yOffset,  h + zOffset,
 
         h, -h + yOffset,  h + zOffset,
        -h, -h + yOffset,  h + zOffset,
 
        -h, -h + yOffset, -h + zOffset,
        -h, -h + yOffset,  h + zOffset,
 
        -h,  h + yOffset, -h + zOffset,
        -h,  h + yOffset,  h + zOffset,
 
         h,  h + yOffset, -h + zOffset,
         h,  h + yOffset,  h + zOffset,
 
         h, -h + yOffset, -h + zOffset,
         h, -h + yOffset,  h + zOffset
      ]
      
  geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );
  return geometry;
}