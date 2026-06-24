import * as THREE from 'three';
import { LEVEL, COLORS } from '../core/Constants.js';

export class LevelBuilder {
  constructor(scene, config = {}) {
    this.scene = scene;
    this.textureLoader = new THREE.TextureLoader();
    this.obstacles = [];
    this.config = this.buildConfig(config);

    this.buildGround();
    this.buildLighting();
    this.buildFog();
    this.buildMountains();
    this.buildTrees();
    this.buildClouds();
  }

  buildConfig(config) {
    const ground = config.ground || {};
    const fog = config.fog || {};
    const mountains = config.mountains || {};
    const trees = config.trees || {};
    const clouds = config.clouds || {};
    const lighting = config.lighting || {};

    return {
      ground: {
        visible: ground.visible ?? true,
        color: ground.color ?? LEVEL.GROUND_COLOR,
        textureUrl: ground.textureUrl || '',
        textureRepeat: Array.isArray(ground.textureRepeat) && ground.textureRepeat.length === 2
          ? ground.textureRepeat
          : [24, 24],
      },
      fog: {
        enabled: fog.enabled ?? true,
        color: fog.color ?? LEVEL.FOG_COLOR,
        near: fog.near ?? LEVEL.FOG_NEAR,
        far: fog.far ?? LEVEL.FOG_FAR,
      },
      mountains: {
        enabled: mountains.enabled ?? true,
        collidable: mountains.collidable ?? true,
        color: mountains.color ?? LEVEL.MOUNTAIN_COLOR,
        snowColor: mountains.snowColor ?? LEVEL.MOUNTAIN_SNOW_COLOR,
        count: mountains.count ?? LEVEL.MOUNTAIN_COUNT,
        spread: mountains.spread ?? LEVEL.MOUNTAIN_SPREAD,
        collisionPadding: mountains.collisionPadding ?? 1.08,
      },
      trees: {
        enabled: trees.enabled ?? true,
        count: trees.count ?? LEVEL.TREE_COUNT,
        color: trees.color ?? LEVEL.TREE_COLOR,
        trunkColor: trees.trunkColor ?? LEVEL.TREE_TRUNK_COLOR,
        spread: trees.spread ?? LEVEL.MOUNTAIN_SPREAD * 1.5,
      },
      clouds: {
        enabled: clouds.enabled ?? true,
        count: clouds.count ?? LEVEL.CLOUD_COUNT,
        color: clouds.color ?? LEVEL.CLOUD_COLOR,
        minY: clouds.minY ?? LEVEL.CLOUD_MIN_Y,
        maxY: clouds.maxY ?? LEVEL.CLOUD_MAX_Y,
        spread: clouds.spread ?? LEVEL.CLOUD_SPREAD,
      },
      lighting: {
        ambientColor: lighting.ambientColor ?? COLORS.AMBIENT_LIGHT,
        ambientIntensity: lighting.ambientIntensity ?? COLORS.AMBIENT_INTENSITY,
        directionalColor: lighting.directionalColor ?? COLORS.DIR_LIGHT,
        directionalIntensity: lighting.directionalIntensity ?? COLORS.DIR_INTENSITY,
        hemiSky: lighting.hemiSky ?? COLORS.HEMI_SKY,
        hemiGround: lighting.hemiGround ?? COLORS.HEMI_GROUND,
        hemiIntensity: lighting.hemiIntensity ?? COLORS.HEMI_INTENSITY,
      },
    };
  }

  buildGround() {
    const groundConfig = this.config.ground;
    const geometry = new THREE.PlaneGeometry(LEVEL.GROUND_SIZE, LEVEL.GROUND_SIZE, 64, 64);

    let material;
    if (groundConfig.textureUrl) {
      const texture = this.textureLoader.load(groundConfig.textureUrl);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(groundConfig.textureRepeat[0], groundConfig.textureRepeat[1]);
      material = new THREE.MeshLambertMaterial({
        color: groundConfig.color,
        map: texture,
      });
    } else {
      const colors = [];
      const baseColor = new THREE.Color(groundConfig.color);
      const posAttr = geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const variation = 0.85 + Math.random() * 0.3;
        colors.push(
          baseColor.r * variation,
          baseColor.g * variation,
          baseColor.b * variation
        );
      }
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      material = new THREE.MeshLambertMaterial({ vertexColors: true });
    }

    this.ground = new THREE.Mesh(geometry, material);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.ground.visible = groundConfig.visible;
    this.scene.add(this.ground);
  }

  buildLighting() {
    const lightingConfig = this.config.lighting;
    const ambient = new THREE.AmbientLight(lightingConfig.ambientColor, lightingConfig.ambientIntensity);
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight(lightingConfig.directionalColor, lightingConfig.directionalIntensity);
    directional.position.set(50, 100, 30);
    directional.castShadow = true;
    this.scene.add(directional);

    // Hemisphere light for sky/ground color blending
    const hemi = new THREE.HemisphereLight(
      lightingConfig.hemiSky,
      lightingConfig.hemiGround,
      lightingConfig.hemiIntensity
    );
    this.scene.add(hemi);
  }

  buildFog() {
    const fogConfig = this.config.fog;
    this.scene.fog = fogConfig.enabled
      ? new THREE.Fog(fogConfig.color, fogConfig.near, fogConfig.far)
      : null;
  }

  buildMountains() {
    const mountainsConfig = this.config.mountains;
    if (!mountainsConfig.enabled) return;

    const mountainMat = new THREE.MeshLambertMaterial({ color: mountainsConfig.color });
    const snowMat = new THREE.MeshLambertMaterial({ color: mountainsConfig.snowColor });

    for (let i = 0; i < mountainsConfig.count; i++) {
      const radius = LEVEL.MOUNTAIN_RADIUS_MIN + Math.random() * (LEVEL.MOUNTAIN_RADIUS_MAX - LEVEL.MOUNTAIN_RADIUS_MIN);
      const height = LEVEL.MOUNTAIN_HEIGHT_MIN + Math.random() * (LEVEL.MOUNTAIN_HEIGHT_MAX - LEVEL.MOUNTAIN_HEIGHT_MIN);
      const segments = 6 + Math.floor(Math.random() * 4);

      const group = new THREE.Group();

      // Mountain body
      const bodyGeo = new THREE.ConeGeometry(radius, height, segments);
      const body = new THREE.Mesh(bodyGeo, mountainMat);
      body.position.y = height / 2;
      group.add(body);

      // Snow cap on tall mountains
      if (height > 35) {
        const capHeight = height * 0.25;
        const capRadius = radius * 0.35;
        const capGeo = new THREE.ConeGeometry(capRadius, capHeight, segments);
        const cap = new THREE.Mesh(capGeo, snowMat);
        cap.position.y = height - capHeight / 2;
        group.add(cap);
      }

      group.position.set(
        (Math.random() - 0.5) * mountainsConfig.spread * 2,
        0,
        (Math.random() - 0.5) * mountainsConfig.spread * 2
      );
      group.rotation.y = Math.random() * Math.PI;
      this.scene.add(group);

      if (mountainsConfig.collidable) {
        this.obstacles.push({
          type: 'cone',
          center: new THREE.Vector3(group.position.x, 0, group.position.z),
          radius: radius * mountainsConfig.collisionPadding,
          height,
          label: `mountain-${i + 1}`,
        });
      }
    }
  }

  checkCollision(point, radius = 1.5) {
    for (const obstacle of this.obstacles) {
      if (obstacle.type === 'cone') {
        const minY = obstacle.center.y - radius;
        const maxY = obstacle.center.y + obstacle.height + radius;
        if (point.y < minY || point.y > maxY) {
          continue;
        }

        const relativeHeight = THREE.MathUtils.clamp(
          (point.y - obstacle.center.y) / obstacle.height,
          0,
          1
        );
        const coneRadiusAtY = obstacle.radius * (1 - relativeHeight);
        const allowedRadius = coneRadiusAtY + radius;
        const dx = point.x - obstacle.center.x;
        const dz = point.z - obstacle.center.z;

        if (dx * dx + dz * dz <= allowedRadius * allowedRadius) {
          return obstacle;
        }
        continue;
      }

      const dx = Math.max(Math.abs(point.x - obstacle.center.x) - obstacle.halfSize.x, 0);
      const dy = Math.max(Math.abs(point.y - obstacle.center.y) - obstacle.halfSize.y, 0);
      const dz = Math.max(Math.abs(point.z - obstacle.center.z) - obstacle.halfSize.z, 0);

      if (dx * dx + dy * dy + dz * dz <= radius * radius) {
        return obstacle;
      }
    }

    return null;
  }

  buildTrees() {
    const treesConfig = this.config.trees;
    if (!treesConfig.enabled) return;

    const trunkMat = new THREE.MeshLambertMaterial({ color: treesConfig.trunkColor });
    const leafMat = new THREE.MeshLambertMaterial({ color: treesConfig.color });

    for (let i = 0; i < treesConfig.count; i++) {
      const group = new THREE.Group();

      // Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 3, 5);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.5;
      group.add(trunk);

      // Layered canopy (2-3 cones for fuller look)
      const layers = 2 + Math.floor(Math.random() * 2);
      for (let j = 0; j < layers; j++) {
        const canopyGeo = new THREE.ConeGeometry(1.8 - j * 0.4, 2.5, 6);
        const canopy = new THREE.Mesh(canopyGeo, leafMat);
        canopy.position.y = 3.5 + j * 1.2;
        group.add(canopy);
      }

      group.position.set(
        (Math.random() - 0.5) * treesConfig.spread,
        0,
        (Math.random() - 0.5) * treesConfig.spread
      );
      const scale = 0.8 + Math.random() * 1.5;
      group.scale.set(scale, scale, scale);
      this.scene.add(group);
    }
  }

  buildClouds() {
    const cloudsConfig = this.config.clouds;
    if (!cloudsConfig.enabled) return;

    const cloudMat = new THREE.MeshBasicMaterial({
      color: cloudsConfig.color,
      transparent: true,
      opacity: 0.8,
      fog: false,
    });

    for (let i = 0; i < cloudsConfig.count; i++) {
      const cloud = new THREE.Group();

      // Build cloud from 3-5 overlapping spheres with varied sizes
      const puffCount = 3 + Math.floor(Math.random() * 3);
      for (let j = 0; j < puffCount; j++) {
        const size = 3 + Math.random() * 5;
        const puffGeo = new THREE.SphereGeometry(size, 8, 6);
        const puff = new THREE.Mesh(puffGeo, cloudMat);
        puff.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 5
        );
        cloud.add(puff);
      }

      cloud.position.set(
        (Math.random() - 0.5) * cloudsConfig.spread * 2,
        cloudsConfig.minY + Math.random() * (cloudsConfig.maxY - cloudsConfig.minY),
        (Math.random() - 0.5) * cloudsConfig.spread * 2
      );
      this.scene.add(cloud);
    }
  }
}
