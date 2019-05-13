function addText(font, text, size) {
  const matLite = new THREE.MeshBasicMaterial( {
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  } );
  const shapes = font.generateShapes( text, size );
  const geometry = new THREE.ShapeBufferGeometry( shapes );
  geometry.computeBoundingBox();
  xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
  geometry.translate( xMid, 0, 0 );
  // make shape ( N.B. edge view not visible )
  text = new THREE.Mesh( geometry, matLite );
  return text
}