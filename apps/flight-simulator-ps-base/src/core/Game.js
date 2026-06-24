import * as THREE from 'three';
import { StreamController } from '@polygon-streaming/web-player-threejs';
import { GAME, CAMERA, COLORS, PLAYER, TRANSITION } from './Constants.js';
import { eventBus, Events } from './EventBus.js';
import { gameState } from './GameState.js';
import { InputSystem } from '../systems/InputSystem.js';
import { RingSystem } from '../systems/RingSystem.js';
import { SkyDome } from '../systems/SkyDome.js';
import { ExhaustSystem } from '../systems/ExhaustSystem.js';
import { ParticleBurst } from '../systems/ParticleBurst.js';
import { SpeedLines } from '../systems/SpeedLines.js';
import { CameraEffects } from '../systems/CameraEffects.js';
import { Player } from '../gameplay/Player.js';
import { LevelBuilder } from '../level/LevelBuilder.js';
import { HUD } from '../ui/HUD.js';
import { Menu } from '../ui/Menu.js';

export class Game {
  constructor() {
    this.clock = new THREE.Clock();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(COLORS.SKY);
    document.body.prepend(this.renderer.domElement);

    // CRITICAL for VIVERSE iframe: canvas must have tabindex for keyboard/mouse capture
    const canvas = this.renderer.domElement;
    canvas.setAttribute('tabindex', '0');
    canvas.style.outline = 'none';
    setTimeout(() => canvas.focus(), 100);
    canvas.addEventListener('mousedown', () => canvas.focus());

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      GAME.FOV,
      window.innerWidth / window.innerHeight,
      GAME.NEAR,
      GAME.FAR
    );
    this.camera.position.set(0, 35, CAMERA.OFFSET_BACK);
    this.camera.lookAt(0, 30, 0);

    // Smooth camera position
    this._camTarget = new THREE.Vector3();
    this._camLookAt = new THREE.Vector3();

    const runtimeConfig = window.__FLIGHT_SIM_CONFIG__ || {};
    this._environmentConfig = runtimeConfig.environmentConfig || {};

    // Persistent systems (exist before game starts)
    this.input = new InputSystem();
    this.level = new LevelBuilder(this.scene, this._environmentConfig);
    this.skyDome = new SkyDome(this.scene, this._environmentConfig.sky || {});
    this.particleBurst = new ParticleBurst(this.scene);
    this.cameraEffects = new CameraEffects(this.camera);
    this.hud = new HUD();
    this.menu = new Menu();

    // Polygon Streaming aircraft URL (empty = use procedural aircraft)
    this._aircraftUrl = runtimeConfig.aircraftUrl || '';
    this._aircraftOffset = this.resolveVector3(runtimeConfig.aircraftOffset, [0, 0, 0]);
    this._aircraftRotationDeg = this.resolveVector3(runtimeConfig.aircraftRotationDeg, [0, 0, 0]);
    this._aircraftScale = this.resolveScale(runtimeConfig.aircraftScale, [1, 1, 1]);

    // Per-session systems (created on game start)
    this.player = null;
    this.ringSystem = null;
    this.exhaust = null;
    this.speedLines = null;
    this.streamController = null;

    // Events
    eventBus.on(Events.GAME_START, () => this.startGame());
    eventBus.on(Events.GAME_RESTART, () => this.restart());
    eventBus.on(Events.PLAYER_DIED, () => this.onCrash());

    // Resize
    window.addEventListener('resize', () => this.onResize());

    // Start render loop
    this.animate();
  }

  startGame() {
    gameState.reset();
    gameState.started = true;

    this.player = new Player(this.scene, this._aircraftUrl);

    // If a PS .xrg URL is configured, stream the aircraft model onto player.group
    if (this._aircraftUrl) {
      const modelAnchor = this.player.getModelAnchor();
      this.applyAircraftTransform(modelAnchor);
      const normalizedAircraftUrl = this.normalizeModelUrl(this._aircraftUrl);
      this._bootstrapPolygonStreaming(normalizedAircraftUrl, modelAnchor);
    }

    this.ringSystem = new RingSystem(this.scene);
    this.exhaust = new ExhaustSystem(this.scene);
    this.speedLines = new SpeedLines(this.scene);

    this.hud.show();
  }

  async _bootstrapPolygonStreaming(url, modelAnchor) {
    this.streamController = new StreamController(
      this.camera, this.renderer, this.scene, this._camLookAt,
      {
        cameraType: 'nonPlayer',
        triangleBudget: 5000000,
        mobileTriangleBudget: 3000000,
      }
    );
    console.info('[FlightSim] StreamController created:', {
      numModels: this.streamController.numModels,
      serviceWorkerSupported: typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
    });

    this.streamController.addEventListener('model-loaded', (event) => {
      console.info('[FlightSim] model-loaded', { type: event?.type, numModels: this.streamController?.numModels });
    });
    this.streamController.addEventListener('model-load-error', (event) => {
      console.error('[FlightSim] model-load-error', { event, aircraftUrl: this._aircraftUrl });
    });

    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      console.info('[FlightSim] SW ready, active state:', reg.active?.state);
    }

    console.info('[FlightSim] calling addModel', url);
    this.streamController.addModel(url, modelAnchor, {
      qualityPriority: 1,
      onModelLoaded: () => {
        console.info('[FlightSim] onModelLoaded', { children: modelAnchor.children.length });
      },
      onModelLoadError: (error) => {
        console.error('[FlightSim] onModelLoadError — falling back to procedural aircraft', error);
        this.player.buildAircraft();
      },
    }).catch((error) => {
      console.error('[FlightSim] addModel rejected — falling back to procedural aircraft', error);
      this.player.buildAircraft();
    });
  }

  onCrash() {
    if (gameState.gameOver) return;
    gameState.gameOver = true;

    // Crash visual effects
    eventBus.emit(Events.CAMERA_SHAKE, {
      intensity: CAMERA.SHAKE_INTENSITY,
      duration: CAMERA.SHAKE_DURATION,
    });
    eventBus.emit(Events.SCREEN_FLASH, { color: '#ff4422' });

    if (this.player) {
      this.particleBurst.emitCrash(this.player.getPosition());
    }

    // Delay before showing game over screen
    setTimeout(() => {
      eventBus.emit(Events.GAME_OVER, { score: gameState.score });
    }, TRANSITION.CRASH_DELAY);
  }

  restart() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
    if (this.ringSystem) {
      this.ringSystem.destroy();
      this.ringSystem = null;
    }
    if (this.exhaust) {
      this.exhaust.destroy();
      this.exhaust = null;
    }
    if (this.speedLines) {
      this.speedLines.destroy();
      this.speedLines = null;
    }
    this.streamController = null;

    gameState.reset();
    this.hud.updateScore(0);
    this.menu.showStart();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), GAME.MAX_DELTA);

    // Always update persistent visual systems
    this.skyDome.update(this.camera.position);
    this.particleBurst.update(delta);
    this.cameraEffects.update(delta);

    if (gameState.started && !gameState.gameOver && this.player) {
      this.player.update(delta, this.input);

      const collision = this.level.checkCollision(
        this.player.getPosition(),
        PLAYER.COLLISION_RADIUS
      );
      if (collision) {
        console.warn('[FlightSim] Player collided with obstacle:', collision.label);
        eventBus.emit(Events.PLAYER_DIED, { obstacle: collision.label });
      }

      // Ring collection
      if (this.ringSystem) {
        this.ringSystem.update(delta, this.player.getPosition());
      }

      // Engine exhaust
      if (this.exhaust) {
        this.exhaust.update(delta, this.player.mesh);
      }

      // Speed lines
      if (this.speedLines) {
        this.speedLines.update(delta, this.player.mesh, this.player.speed);
      }

      // Update HUD instruments
      this.hud.updateAltitude(this.player.getPosition().y);
      this.hud.updateSpeed(this.player.speed * 3.6);

      // Chase camera
      this.updateCamera(delta);
    }

    this.renderer.render(this.scene, this.camera);

    // PS StreamController update must run after renderer.render()
    if (this.streamController) {
      this.streamController.update();
    }
  }

  updateCamera(delta) {
    const playerPos = this.player.getPosition();
    const playerForward = this.player.getForward();

    // Target position: behind and above the aircraft
    this._camTarget.copy(playerPos);
    this._camTarget.addScaledVector(playerForward, -CAMERA.OFFSET_BACK);
    this._camTarget.y = playerPos.y + CAMERA.OFFSET_UP;

    // Smoothly lerp camera to target
    const lerpFactor = 1 - Math.exp(-CAMERA.LERP_SPEED * delta);
    this.camera.position.lerp(this._camTarget, lerpFactor);

    // Look ahead of the plane
    this._camLookAt.copy(playerPos);
    this._camLookAt.addScaledVector(playerForward, CAMERA.LOOK_AHEAD);
    this.camera.lookAt(this._camLookAt);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  resolveVector3(value, fallback) {
    if (!Array.isArray(value) || value.length !== 3) return fallback;
    return value.map((entry, index) => {
      const parsed = Number(entry);
      return Number.isFinite(parsed) ? parsed : fallback[index];
    });
  }

  resolveScale(value, fallback) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return [value, value, value];
    }
    return this.resolveVector3(value, fallback);
  }

  applyAircraftTransform(anchor) {
    anchor.position.set(...this._aircraftOffset);
    anchor.rotation.set(...this._aircraftRotationDeg.map((value) => THREE.MathUtils.degToRad(value)));
    anchor.scale.set(...this._aircraftScale);
  }

  vectorToObject(vector) {
    return {
      x: Number(vector.x.toFixed(4)),
      y: Number(vector.y.toFixed(4)),
      z: Number(vector.z.toFixed(4)),
    };
  }

  normalizeModelUrl(value) {
    if (typeof value === 'string') {
      return value;
    }
    if (value && typeof value === 'object') {
      if (typeof value.resourceLink === 'string') {
        return value.resourceLink;
      }
      if (typeof value.pathOrUrl === 'string') {
        return value.pathOrUrl;
      }
      if (typeof value.url === 'string') {
        return value.url;
      }
    }
    return String(value ?? '');
  }
}
