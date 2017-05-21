/**
 * Renders all points in a particulate system
 */
import {
  Group, 
  BufferAttribute, 
  BufferGeometry,
  Points, PointsMaterial, 
  Line, LineBasicMaterial,
} from 'three';

class ParticulateRenderer extends Group{
  constructor() {
    super();
  }
  init(system) {
    const vertices = new BufferAttribute(system.positions, 3);
    // const indices = new BufferAttribute(new Uint16Array(dist.indices));
    this.dotsGeom = new BufferGeometry();
    this.dotsGeom.addAttribute('position', vertices);
    const dots = new Points(
      this.dotsGeom,
      new PointsMaterial({ size: 0.01 })
    );
    this.add(dots);
  }
  update() {
    this.dotsGeom.attributes.position.needsUpdate = true;
  }
}

export default ParticulateRenderer;
