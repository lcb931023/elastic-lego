global.THREE = require('three');
import { 
  ParticleSystem, 
  DistanceConstraint,
  AngleConstraint,
  PointConstraint,
  DirectionalForce,
  BoxConstraint,
} from 'particulate';
import ParticulateRenderer from './lib/particulateRenderer';
const createOrbitViewer = require('three-orbit-viewer')(THREE)

/* Simulation */
const PARTICLE_COUNT = 150;
const RELAX_ITERATIONS = 2;
const LINK_DIST = 0.02;
const ANGLE = Math.PI * 0.5;
const GRAVITY = -0.5;
const system = ParticleSystem.create(PARTICLE_COUNT, RELAX_ITERATIONS);
const gravity = DirectionalForce.create([0, GRAVITY, 0]);
const bounds = BoxConstraint.create([-0.5, -0.5, -0.5], [0.5, 0.5, 0.5]);
let linkIndices = [];
let angleIndices = [];
system.each((i)=>{
  let a = i - 1;
  let b = i;
  if ( i > 0 && i < PARTICLE_COUNT - 1 ) {
    system.setPosition(i,
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 1.5
    );
  }
  if (i > 0) {
    linkIndices.push(a, b);
  }
  if (i > 0 && i < PARTICLE_COUNT - 1) {
    angleIndices.push(a, b, b + 1);
  }
});
system.addConstraint(DistanceConstraint.create(LINK_DIST, linkIndices));
system.addConstraint(AngleConstraint.create(ANGLE, angleIndices));
const pinX = 0.5;
const index0 = 0;
const index1 = PARTICLE_COUNT - 1;
const pin0 = PointConstraint.create([-pinX, 0, 0], index0);
const pin1 = PointConstraint.create([ pinX, 0, 0], index1);
system.setWeight(index0, 0);
system.setWeight(index1, 0);
system.addPinConstraint(pin0);
system.addPinConstraint(pin1);
system.addConstraint(bounds);
system.addForce(gravity);

/* Scene */
const app = createOrbitViewer({
  clearColor: 0x000000,
  clearAlpha: 1,
  fov: 65,
  position: new THREE.Vector3(0, 0, 1), // camera
})

const visual = new ParticulateRenderer();
visual.init(system);
app.scene.add(visual);

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
  new THREE.MeshBasicMaterial({
    wireframe : true
  }));
app.scene.add(box)

app.on('tick', function(dt) {
  //.. handle pre-render updates
  system.tick(dt/1000);
  visual.update();
})
