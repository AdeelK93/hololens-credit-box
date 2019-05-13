var camera, scene, renderer;

var speechRecognizer, filterDate = '2017-01-01'

const fontLoader = new THREE.FontLoader();

async function init() {
  const canvas = document.createElement('canvasvr');
  
  const csv = await request({url: "data/creditDensity.csv"})
  let data = csv.split(/\r?\n/)
  .map(row => row.split(','))
  const header = data.shift()
  // remove last element if csv has trailing line feed
  if (data[data.length-1].length < 4) data.pop()

  const dataVars = [2, 3, 1]
  const filterVar = 0
  const colorVar = 4

  // find min/max of values for normalization
  var values, minVals = [], maxVals = [];
  dataVars.forEach(i => {
    values = data.map(d => +d[i])
    minVals.push(Math.min.apply(null, values))
    maxVals.push(Math.max.apply(null, values))
  })
  delete values

  // filter to jan 2017, just for now
  data = data.filter(d => d[filterVar] === filterDate)
  
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.2, 1000 );
  camera.position.set(0.5, 0.5, 0.5);
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x050505 );
  scene.fog = new THREE.Fog( 0x050505, 0.2, 1000 );
  //
  // var particles = 50000;
  var geometry = new THREE.BufferGeometry();
  var positions = [];
  var colors = [];
  // offsets help make the cube visible when entering the world
  const yOffset = 1.6
  const zOffset = -1.5
  // const n = 1, n2 = n / 2; // particles spread in the cube
  data.forEach(point => {
    // scale points down, then set them spatially
    // normalization function x-min(x))/(max(x)-min(x)
    const x = ((+point[dataVars[0]]-minVals[0])/(maxVals[0]-minVals[0])) - 0.5
    const y = ((+point[dataVars[1]]-minVals[1])/(maxVals[1]-minVals[1])) - 0.5
    const z = ((+point[dataVars[2]]-minVals[2])/(maxVals[2]-minVals[2])) - 0.5
    positions.push( x, y+yOffset, z+zOffset );
    
    const color = new THREE.Color(point[colorVar])
    colors.push(color.r, color.g, color.b)
  })
  
  geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
  geometry.computeBoundingSphere();
  //
  const sprite = new THREE.TextureLoader().load( 'assets/disc.png' );
  const material = new THREE.PointsMaterial({
    size: /*0.01*/ 0.03,
    vertexColors: THREE.VertexColors,
    map: sprite,
    transparent: true,
    alphaTest: 0.5
  });
  const points = new THREE.Points( geometry, material );
  scene.add( points );
  
  var geometryCube = cube( 1, yOffset, zOffset );
  var lineSegments = new THREE.LineSegments( geometryCube, new THREE.LineDashedMaterial({
    color: 0xffaa00, dashSize: .06, gapSize: .02
  }) );
  lineSegments.computeLineDistances();
  scene.add( lineSegments );

  fontLoader.load( 'assets/helvetiker_regular.typeface.json', function ( font ) {
    // x-axis label, font size is 0.1
    const xLabelNear = addText(font, header[dataVars[0]], 0.1)
    // offset by chart size (1) divided by 2, and then add the font size, yielding 0.6
    xLabelNear.position.set(0, yOffset-0.6, zOffset+0.5)
    scene.add(xLabelNear)
    const xLabelFar = addText(font, reverseString(header[dataVars[0]]), 0.1)
    xLabelFar.position.set(0, yOffset-0.6, zOffset-0.5)
    // rotate the far axis label
    xLabelFar.rotation.set(0, Math.PI, 0)
    scene.add(xLabelFar)

    // y-axis label
    const yLabelNear = addText(font, header[dataVars[1]], 0.1)
    yLabelNear.position.set(-0.5, yOffset, zOffset+0.5)
    yLabelNear.rotation.set(0, 0, Math.PI/2)
    scene.add(yLabelNear)
    const yLabelFar = addText(font, header[dataVars[1]], 0.1)
    yLabelFar.position.set(0.5, yOffset, zOffset-0.5)
    yLabelFar.rotation.set(Math.PI, 0, -Math.PI/2)
    scene.add(yLabelFar)

    // z-axis label
    const zLabelLeft = addText(font, header[dataVars[2]], 0.1)
    zLabelLeft.position.set(-0.5, yOffset-0.6, zOffset)
    zLabelLeft.rotation.set(0, -Math.PI/2, 0)
    scene.add(zLabelLeft)
    const zLabelRight = addText(font, reverseString(header[dataVars[2]]), 0.1)
    zLabelRight.position.set(0.5, yOffset-0.6, zOffset)
    zLabelRight.rotation.set(0, Math.PI/2, 0)
    scene.add(zLabelRight)
  } );
  //
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setAnimationLoop(render);
  window.addEventListener('resize', onWindowResize, false);
  
  // Enter immersive mode if available
  navigator.getVRDisplays().then(
    function (value) {
      if (value.length > 0) {
        renderer.vr.enabled = true;
        renderer.vr.setDevice(value[0]);
        value[0].requestPresent([{ source: renderer.domElement }]);
      }
  });
}
  
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  renderer.render(scene, camera);
}
  
init();
initSpeech();