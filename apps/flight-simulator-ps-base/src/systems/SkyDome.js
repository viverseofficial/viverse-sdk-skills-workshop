import * as THREE from 'three';
import { SKY } from '../core/Constants.js';

export class SkyDome {
  constructor(scene, config = {}) {
    this.scene = scene;
    this.textureLoader = new THREE.TextureLoader();
    this.config = {
      enabled: config.enabled ?? true,
      textureUrl: config.textureUrl || '',
      topColor: config.topColor ?? SKY.TOP_COLOR,
      horizonColor: config.horizonColor ?? SKY.HORIZON_COLOR,
      domeRadius: config.domeRadius ?? SKY.DOME_RADIUS,
      sunEnabled: config.sunEnabled ?? true,
      sunColor: config.sunColor ?? SKY.SUN_COLOR,
      sunGlowColor: config.sunGlowColor ?? SKY.SUN_GLOW_COLOR,
      sunRadius: config.sunRadius ?? SKY.SUN_RADIUS,
      sunGlowRadius: config.sunGlowRadius ?? SKY.SUN_GLOW_RADIUS,
      sunElevation: config.sunElevation ?? SKY.SUN_ELEVATION,
      sunDistance: config.sunDistance ?? SKY.SUN_DISTANCE,
    };

    if (!this.config.enabled) return;

    this.buildDome();
    if (this.config.sunEnabled) {
      this.buildSun();
    }
  }

  buildDome() {
    const geo = new THREE.SphereGeometry(this.config.domeRadius, 32, 16);

    if (this.config.textureUrl) {
      const texture = this.textureLoader.load(this.config.textureUrl);
      texture.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
        fog: false,
      });
      this.dome = new THREE.Mesh(geo, mat);
      this.scene.add(this.dome);
      return;
    }

    // Vertex color gradient: deep blue at top → warm horizon at bottom
    const colors = [];
    const topColor = new THREE.Color(this.config.topColor);
    const horizonColor = new THREE.Color(this.config.horizonColor);
    const posAttr = geo.attributes.position;

    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      // Normalize: top of sphere = 1, equator = 0, bottom = -1
      const t = THREE.MathUtils.clamp((y / this.config.domeRadius + 0.1) * 0.9, 0, 1);
      const color = new THREE.Color().lerpColors(horizonColor, topColor, t);
      colors.push(color.r, color.g, color.b);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.BackSide,
      fog: false,
    });

    this.dome = new THREE.Mesh(geo, mat);
    this.scene.add(this.dome);
  }

  buildSun() {
    // Sun glow (large, transparent)
    const glowGeo = new THREE.CircleGeometry(this.config.sunGlowRadius, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: this.config.sunGlowColor,
      transparent: true,
      opacity: 0.3,
      fog: false,
      side: THREE.DoubleSide,
    });
    this.glow = new THREE.Mesh(glowGeo, glowMat);
    this.glow.position.set(0, this.config.sunElevation, this.config.sunDistance);
    this.glow.lookAt(0, 0, 0);
    this.scene.add(this.glow);

    // Sun core (bright, smaller)
    const sunGeo = new THREE.CircleGeometry(this.config.sunRadius, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: this.config.sunColor,
      fog: false,
      side: THREE.DoubleSide,
    });
    this.sun = new THREE.Mesh(sunGeo, sunMat);
    this.sun.position.set(0, this.config.sunElevation, this.config.sunDistance);
    this.sun.lookAt(0, 0, 0);
    this.scene.add(this.sun);
  }

  update(cameraPosition) {
    // Keep sky dome centered on camera so it never clips
    if (this.dome) {
      this.dome.position.copy(cameraPosition);
    }
  }
}
