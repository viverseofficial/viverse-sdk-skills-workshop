import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './styles.css';
import { VERSION_NAME, APP_ID } from './config.js';
import * as Auth from './viverseAuth.js';
import * as Avatar from './viverseAvatar.js';
import * as MP from './viverseMultiplayer.js';
import * as Leaderboard from './viverseLeaderboard.js';

const app = document.getElementById('app');
const gltfLoader = new GLTFLoader();
const modelCache = new Map();
const CITY = 'assets/kenney/city-commercial/Models/GLB format/';
const ROADS = 'assets/kenney/city-roads/Models/GLB format/';
const FOOD = 'assets/kenney/food-kit/Models/GLB format/';
const FESTIVAL_FOOD_ITEMS = [
  'dim-sum.glb',
  'sushi-salmon.glb',
  'sushi-egg.glb',
  'maki-salmon.glb',
  'burger-cheese.glb',
  'fries.glb',
  'donut-sprinkles.glb',
  'cup-tea.glb',
  'carton-small.glb',
  'banana.glb',
  'apple.glb',
  'corn-dog.glb',
  'bowl-soup.glb',
  'skewer.glb',
  'skewer-vegetables.glb',
  'hot-dog.glb',
  'pancakes.glb'
];

const ARENAS = [
  {
    id: 'festival',
    name: 'Festival Town',
    ground: '#344737',
    fog: '#263436',
    accent: '#e7c46a',
    ambient: '#f4c27a',
    props: [
      { id: 'lantern', name: 'Lantern', kind: 'lantern', scale: [0.7, 1.25, 0.7], scanSignature: 0.54, mobility: 0.74 },
      { id: 'crate', name: 'Crate', kind: 'crate', scale: [1.15, 1.0, 1.15], scanSignature: 0.42, mobility: 0.66 },
      { id: 'barrel', name: 'Barrel', kind: 'barrel', scale: [0.72, 0.95, 0.72], scanSignature: 0.48, mobility: 0.6 },
      { id: 'sign', name: 'Shop Sign', kind: 'sign', asset: `${CITY}detail-awning.glb`, scale: [1.35, 1.7, 0.28], assetScale: 1.5, scanSignature: 0.68, mobility: 0.44 },
      { id: 'tableUmbrella', name: 'Table Umbrella', kind: 'tableUmbrella', scale: [0.9, 0.9, 0.9], scanSignature: 0.56, mobility: 0.38 },
      { id: 'foodCarton', name: 'Food Carton', kind: 'food', asset: `${FOOD}carton-small.glb`, scale: [0.9, 0.9, 0.9], assetScale: 1.75, scanSignature: 0.52, mobility: 0.82 },
      { id: 'teaCup', name: 'Tea Cup', kind: 'food', asset: `${FOOD}cup-tea.glb`, scale: [0.9, 0.9, 0.9], assetScale: 1.8, scanSignature: 0.55, mobility: 0.9 },
      { id: 'planter', name: 'Planter', kind: 'planter', scale: [1.35, 0.8, 0.75], scanSignature: 0.38, mobility: 0.52 }
    ]
  },
  {
    id: 'school',
    name: 'School After Hours',
    ground: '#394150',
    fog: '#27303c',
    accent: '#7dc4e8',
    ambient: '#cad7e8',
    props: [
      { id: 'chair', name: 'Chair', kind: 'chair', scale: [0.9, 1.15, 0.9], scanSignature: 0.46, mobility: 0.82 },
      { id: 'desk', name: 'Desk', kind: 'desk', scale: [1.45, 0.9, 0.95], scanSignature: 0.4, mobility: 0.48 },
      { id: 'locker', name: 'Locker', kind: 'locker', scale: [0.85, 1.9, 0.65], scanSignature: 0.72, mobility: 0.36 },
      { id: 'cone', name: 'Traffic Cone', kind: 'cone', asset: `${ROADS}construction-cone.glb`, scale: [0.75, 1.0, 0.75], assetScale: 1.25, scanSignature: 0.58, mobility: 0.86 },
      { id: 'bucket', name: 'Bucket', kind: 'bucket', scale: [0.78, 0.72, 0.78], scanSignature: 0.5, mobility: 0.9 },
      { id: 'schoolBag', name: 'School Bag', kind: 'schoolBag', scale: [1, 1, 1], scanSignature: 0.5, mobility: 0.86 },
      { id: 'bookStack', name: 'Book Stack', kind: 'bookStack', scale: [1, 1, 1], scanSignature: 0.44, mobility: 0.9 }
    ]
  },
  {
    id: 'arcade',
    name: 'Arcade Mall',
    ground: '#2b2c44',
    fog: '#22233a',
    accent: '#ff6eb6',
    ambient: '#86fff1',
    props: [
      { id: 'vending', name: 'Vending Machine', kind: 'vending', asset: `${CITY}building-d.glb`, scale: [1.15, 2.25, 0.8], assetScale: 0.34, scanSignature: 0.78, mobility: 0.28 },
      { id: 'stool', name: 'Arcade Stool', kind: 'stool', scale: [0.85, 0.82, 0.85], scanSignature: 0.44, mobility: 0.88 },
      { id: 'standee', name: 'Cardboard Standee', kind: 'standee', asset: `${CITY}detail-overhang.glb`, scale: [1.2, 1.9, 0.24], assetScale: 1.4, scanSignature: 0.7, mobility: 0.5 },
      { id: 'prizeBox', name: 'Prize Box', kind: 'crate', scale: [1.05, 0.85, 1.05], scanSignature: 0.36, mobility: 0.72 },
      { id: 'capsule', name: 'Capsule Machine', kind: 'capsule', scale: [0.95, 1.55, 0.95], scanSignature: 0.62, mobility: 0.5 },
      { id: 'arcadeCabinet', name: 'Arcade Cabinet', kind: 'arcadeCabinet', scale: [0.92, 0.92, 0.92], scanSignature: 0.7, mobility: 0.38 }
    ]
  }
];

const state = {
  arenaIndex: 0,
  role: 'hider',
  phase: 'hide',
  started: false,
  timer: 45,
  score: 0,
  caught: false,
  remaining: 4,
  selectedProp: 0,
  disguised: false,
  shield: 0,
  shieldCooldown: 0,
  laser: 0,
  laserCooldown: 0,
  online: false,
  matchId: null,
  messageTitle: 'Choose a role and arena',
  messageBody: 'Hiders transform into props. Seekers inspect suspicious objects.',
  roundSeed: 1
};

const keys = new Set();
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const forward = new THREE.Vector3();
const tempVec = new THREE.Vector3();
const moveVec = new THREE.Vector3();

let scene;
let camera;
let renderer;
let playerRoot;
let avatarMesh;
let playerPropMesh = null;
let seekerMesh = null;
let ground;
let cameraYaw = 0;
let cameraPitch = 0.48;
let dragActive = false;
let lastPointerX = 0;
let lastPointerY = 0;
let props = [];
let fakeHiders = [];
let obstacles = [];
let patrolPoints = [];
let seekerPatrolIndex = 0;
let currentTarget = null;
let hoveredProp = null;
let scanHighlights = [];
let lastFrameTime = 0;
let remotePlayers = new Map(); // actorId → {mesh, lastUpdate, targetPos, targetRot}
let positionBroadcastTimer = 0;

const ui = createUi();
init();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 180);

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const canvas = renderer.domElement;
  canvas.setAttribute('tabindex', '0');
  canvas.style.outline = 'none';
  app.appendChild(canvas);
  setTimeout(() => canvas.focus(), 100);
  canvas.addEventListener('mousedown', () => canvas.focus());

  buildArena();
  bindEvents(canvas);
  updateUi();
  requestAnimationFrame(loop);
  console.log(`[HideAndSeek] ${VERSION_NAME} startup`);

  // Non-blocking VIVERSE auth + avatar bootstrap
  Auth.initialize().then((authState) => {
    updateProfileChip();
    if (authState.isAuthenticated && authState.profile?.avatar3dUrl) {
      avatarMesh.userData.isAvatarPlaceholder = true;
      Avatar.loadAvatar(authState.profile.avatar3dUrl, playerRoot, {
        targetHeight: 1.7,
        onLoad: () => console.log('[HideAndSeek] Avatar loaded'),
      });
    }
  }).catch(() => updateProfileChip());

  Auth.onAuthChange(() => updateProfileChip());
}

function bindEvents(canvas) {
  window.addEventListener('resize', resize);
  window.addEventListener('keydown', event => {
    keys.add(event.code);
    if (event.code === 'KeyE') useInteract();
    if (event.code === 'KeyQ') useTool();
    if (event.code === 'KeyR') rotateDisguise();
    if (event.code === 'KeyF') seekerTag();
    if (event.code === 'Space') event.preventDefault();
  });
  window.addEventListener('keyup', event => keys.delete(event.code));

  let pointerDownTime = 0;
  let pointerMoved = false;
  canvas.addEventListener('pointerdown', event => {
    dragActive = true;
    pointerMoved = false;
    pointerDownTime = performance.now();
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
  });
  window.addEventListener('pointerup', (event) => {
    const elapsed = performance.now() - pointerDownTime;
    const wasClick = elapsed < 300 && !pointerMoved;
    dragActive = false;
    if (wasClick && state.role === 'hider' && (!state.started || state.phase === 'hide')) {
      handlePretendClick(event);
    }
  });
  window.addEventListener('pointermove', event => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    if (!dragActive) return;
    const dx = event.clientX - lastPointerX;
    const dy = event.clientY - lastPointerY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) pointerMoved = true;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    cameraYaw -= dx * 0.005;
    cameraPitch = THREE.MathUtils.clamp(cameraPitch + dy * 0.0035, 0.18, 1.18);
  });
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function buildArena() {
  const arena = getArena();
  props = [];
  fakeHiders = [];
  obstacles = [];
  patrolPoints = [];
  scanHighlights = [];
  currentTarget = null;

  scene.clear();
  scene.background = new THREE.Color(arena.fog);
  scene.fog = new THREE.Fog(arena.fog, 28, 82);

  const hemi = new THREE.HemisphereLight(arena.ambient, '#182024', 1.4);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight('#fff5df', 2.6);
  sun.position.set(-8, 16, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 55;
  sun.shadow.camera.left = -34;
  sun.shadow.camera.right = 34;
  sun.shadow.camera.top = 34;
  sun.shadow.camera.bottom = -34;
  scene.add(sun);

  ground = new THREE.Mesh(
    new THREE.BoxGeometry(54, 0.5, 54),
    new THREE.MeshStandardMaterial({ color: arena.ground, roughness: 0.86 })
  );
  ground.position.y = -0.25;
  ground.receiveShadow = true;
  scene.add(ground);

  addBoundary(arena);
  addGroundDetail(arena);
  addArenaArchitecture(arena);
  addProps(arena);
  createPlayer();
  createPracticeActors();
  setMessage('Local prototype ready', state.role === 'hider'
    ? 'Click any prop to pretend to be it, use Scan Shield with Q.'
    : 'Press Start. Scan with Q, inspect/tag suspicious props with E or F.');
}

function addBoundary(arena) {
  const material = new THREE.MeshStandardMaterial({ color: '#202832', roughness: 0.8 });
  const wallGeo = new THREE.BoxGeometry(56, 3, 1);
  const walls = [
    [0, 1.5, -28, 0],
    [0, 1.5, 28, 0],
    [-28, 1.5, 0, Math.PI / 2],
    [28, 1.5, 0, Math.PI / 2]
  ];
  for (const [x, y, z, rot] of walls) {
    const wall = new THREE.Mesh(wallGeo, material);
    wall.position.set(x, y, z);
    wall.rotation.y = rot;
    wall.receiveShadow = true;
    wall.castShadow = true;
    scene.add(wall);
  }

}

function addGroundDetail(arena) {
  if (arena.id === 'festival') {
    addFestivalGround(arena);
    return;
  }
  if (arena.id === 'school') {
    addSchoolGround(arena);
    return;
  }
  addArcadeGround(arena);
}

function addFestivalGround(arena) {
  const stoneMats = [
    new THREE.MeshStandardMaterial({ color: '#3f4d3a', roughness: 0.96 }),
    new THREE.MeshStandardMaterial({ color: '#4a573f', roughness: 0.96 }),
    new THREE.MeshStandardMaterial({ color: '#364334', roughness: 0.96 })
  ];
  const pathMat = new THREE.MeshStandardMaterial({ color: '#8d7752', roughness: 0.9 });
  const edgeMat = new THREE.MeshStandardMaterial({ color: '#d1b76a', roughness: 0.72, emissive: '#2b2208', emissiveIntensity: 0.18 });

  addPavingPatch(-12, -9, 15, 9, 1.8, stoneMats, 0.055);
  addPavingPatch(10, 9, 18, 10, 1.8, stoneMats, 0.055);
  addPavingPatch(-1, 15, 18, 6, 1.8, stoneMats, 0.055);

  const main = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.06, 54), pathMat);
  main.position.set(0, 0.045, 0);
  scene.add(main);
  const cross = new THREE.Mesh(new THREE.BoxGeometry(54, 0.055, 6.2), pathMat);
  cross.position.set(0, 0.05, 0);
  scene.add(cross);

  [
    [-3.8, 0, 0.08, 54],
    [3.8, 0, 0.08, 54],
    [0, -3.3, 54, 0.08],
    [0, 3.3, 54, 0.08]
  ].forEach(([x, z, sx, sz]) => {
    const edge = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.08, sz), edgeMat);
    edge.position.set(x, 0.09, z);
    scene.add(edge);
  });

  for (let i = -24; i <= 24; i += 4) {
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 6.1), edgeMat);
    seam.position.set(i, 0.1, 0);
    scene.add(seam);
  }
}

function addSchoolGround(arena) {
  const tileA = new THREE.MeshStandardMaterial({ color: '#313b48', roughness: 0.88 });
  const tileB = new THREE.MeshStandardMaterial({ color: '#28323e', roughness: 0.9 });
  const hallMat = new THREE.MeshStandardMaterial({ color: '#202834', roughness: 0.86 });
  const lineMat = new THREE.MeshStandardMaterial({ color: arena.accent, roughness: 0.7, emissive: arena.accent, emissiveIntensity: 0.16 });

  for (let x = -16; x <= 16; x += 2) {
    for (let z = -16; z <= 4; z += 2) {
      const tile = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.045, 1.92), ((x + z) / 2) % 2 === 0 ? tileA : tileB);
      tile.position.set(x, 0.08, z);
      scene.add(tile);
    }
  }

  const hall = new THREE.Mesh(new THREE.BoxGeometry(34, 0.05, 7.5), hallMat);
  hall.position.set(0, 0.075, 11.3);
  scene.add(hall);

  for (let x = -14; x <= 14; x += 4) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.07, 7.5), lineMat);
    strip.position.set(x, 0.11, 11.3);
    scene.add(strip);
  }
  const threshold = new THREE.Mesh(new THREE.BoxGeometry(34, 0.08, 0.12), lineMat);
  threshold.position.set(0, 0.12, 5.4);
  scene.add(threshold);
}

function addArcadeGround(arena) {
  const carpetA = new THREE.MeshStandardMaterial({ color: '#25243f', roughness: 0.92 });
  const carpetB = new THREE.MeshStandardMaterial({ color: '#302856', roughness: 0.92 });
  const neonMat = new THREE.MeshStandardMaterial({ color: arena.accent, emissive: arena.accent, emissiveIntensity: 0.65, roughness: 0.5 });
  addPavingPatch(0, 0, 44, 32, 2.2, [carpetA, carpetB], 0.065);

  [
    [0, -18, 42, 0.1],
    [0, 18, 42, 0.1],
    [-20, 0, 0.1, 34],
    [20, 0, 0.1, 34],
    [0, 0, 40, 0.08],
    [0, 0, 0.08, 30]
  ].forEach(([x, z, sx, sz]) => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.08, sz), neonMat);
    line.position.set(x, 0.12, z);
    scene.add(line);
  });
}

function addPavingPatch(centerX, centerZ, width, depth, tileSize, materials, y) {
  const cols = Math.floor(width / tileSize);
  const rows = Math.floor(depth / tileSize);
  const startX = centerX - (cols * tileSize) / 2 + tileSize / 2;
  const startZ = centerZ - (rows * tileSize) / 2 + tileSize / 2;
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const mat = materials[(col + row * 2) % materials.length];
      const tile = new THREE.Mesh(new THREE.BoxGeometry(tileSize * 0.92, 0.045, tileSize * 0.92), mat);
      tile.position.set(startX + col * tileSize, y, startZ + row * tileSize);
      tile.rotation.y = ((col * 17 + row * 11) % 4) * Math.PI * 0.5;
      tile.receiveShadow = true;
      scene.add(tile);
    }
  }
}

function addArenaArchitecture(arena) {
  if (arena.id === 'festival') {
    addFestivalScenery(arena);
    return;
  }
  if (arena.id === 'school') {
    addSchoolScenery(arena);
    return;
  }
  addArcadeScenery(arena);
}

function addFestivalScenery(arena) {
  const mat = new THREE.MeshStandardMaterial({ color: '#5e5346', roughness: 0.78 });
  const roofMat = new THREE.MeshStandardMaterial({ color: '#2a2f34', roughness: 0.8 });
  const stallPositions = [
    [-19, -15, 0], [-12, -19, Math.PI / 2], [13, -18, Math.PI / 2],
    [20, -10, Math.PI], [-20, 9, 0], [-13, 18, Math.PI / 2],
    [12, 19, Math.PI / 2], [20, 10, Math.PI]
  ];
  stallPositions.forEach(([x, z, ry], index) => {
    const group = createFoodStand(arena, mat, roofMat, index);
    group.position.set(x, 0, z);
    group.rotation.y = ry;
    scene.add(group);
    obstacles.push(group);
  });

  [
    ['building-b.glb', -23, 0, -2, 0.65, Math.PI / 2],
    ['building-e.glb', 23, 0, 0, 0.62, -Math.PI / 2],
    ['low-detail-building-wide-a.glb', -5, 0, -24, 1.1, 0],
    ['low-detail-building-wide-b.glb', 6, 0, 24, 1.1, Math.PI]
  ].forEach(([file, x, y, z, s, ry]) => spawnAsset(`${CITY}${file}`, [x, y, z], s, [0, ry, 0]));

  for (let i = -18; i <= 18; i += 9) {
    const umbrella = createTableUmbrella(arena, i % 2 ? '#2f9d69' : '#3eb076');
    umbrella.position.set(i, 0, -7);
    umbrella.rotation.y = i * 0.2;
    scene.add(umbrella);
    spawnAsset(`${ROADS}light-curved.glb`, [i, 0, 7], 1.2, [0, Math.PI, 0]);
  }
  [-9, -3, 3, 9].forEach((x, index) => {
    const counter = createCounterWithFood(index);
    counter.position.set(x, 0.42, 13);
    scene.add(counter);
  });
  addLanternStrings(arena);
  addFestivalCrateLanes(arena);
  addFestivalLandmarks(arena);
  addFestivalSeatingAndSteam(arena);
  patrolPoints = [
    new THREE.Vector3(-20, 0, -20),
    new THREE.Vector3(18, 0, -18),
    new THREE.Vector3(20, 0, 17),
    new THREE.Vector3(-18, 0, 18),
    new THREE.Vector3(0, 0, 0)
  ];
}

function addFestivalSeatingAndSteam(arena) {
  const stoolMat = new THREE.MeshStandardMaterial({ color: '#6a4a33', roughness: 0.72 });
  const tableMat = new THREE.MeshStandardMaterial({ color: '#8b5f3e', roughness: 0.72 });
  const steamMat = new THREE.MeshBasicMaterial({ color: '#f7f3ea', transparent: true, opacity: 0.28, depthWrite: false });
  const seating = [
    [-14, 3], [-9, 3], [9, 3], [14, 3], [-14, -13], [-9, -13], [9, -13], [14, -13],
    [-14, 17], [-8, 17], [8, 17], [14, 17]
  ];
  seating.forEach(([x, z], index) => {
    const table = new THREE.Group();
    table.add(mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.12, 18), tableMat, [0, 0.62, 0]));
    table.add(mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.62, 10), stoolMat, [0, 0.31, 0]));
    const umbrella = createTableUmbrella(arena, index % 3 === 0 ? '#3eb076' : index % 3 === 1 ? '#d7b34c' : '#4da1d9');
    umbrella.position.set(0, 0, 0);
    umbrella.scale.setScalar(0.92);
    table.add(umbrella);
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + index * 0.3;
      table.add(mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.28, 12), stoolMat, [Math.cos(angle) * 1.35, 0.18, Math.sin(angle) * 1.35]));
    }
    const file = FESTIVAL_FOOD_ITEMS[(index * 2) % FESTIVAL_FOOD_ITEMS.length];
    spawnAsset(`${FOOD}${file}`, [0, 0.74, 0], foodScaleFor(file) * 0.72, [0, index * 0.4, 0], table);
    table.position.set(x, 0, z);
    table.traverse(enableShadows);
    scene.add(table);
  });

  [[-15, -4], [-5, -4], [5, -4], [15, -4], [-15, 8], [15, 8]].forEach(([x, z], index) => {
    const steam = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(0.12 + i * 0.03, 8, 6), steamMat.clone());
      puff.position.set(Math.sin(i * 1.7) * 0.16, 1.05 + i * 0.26, Math.cos(i * 1.3) * 0.12);
      steam.add(puff);
    }
    steam.position.set(x, 0, z);
    scene.add(steam);
  });
}

function addFestivalLandmarks(arena) {
  const redMat = new THREE.MeshStandardMaterial({ color: '#b8312c', roughness: 0.62, emissive: '#240402', emissiveIntensity: 0.22 });
  const darkMat = new THREE.MeshStandardMaterial({ color: '#201918', roughness: 0.72 });
  const woodMat = new THREE.MeshStandardMaterial({ color: '#6f4b32', roughness: 0.76 });
  const clothMat = new THREE.MeshStandardMaterial({ color: '#e7c46a', roughness: 0.62, emissive: '#2a2105', emissiveIntensity: 0.2 });

  const gate = new THREE.Group();
  gate.add(mesh(new THREE.BoxGeometry(0.72, 4.2, 0.72), redMat, [-2.9, 2.1, 0]));
  gate.add(mesh(new THREE.BoxGeometry(0.72, 4.2, 0.72), redMat, [2.9, 2.1, 0]));
  gate.add(mesh(new THREE.BoxGeometry(7.4, 0.72, 0.82), redMat, [0, 4.1, 0]));
  gate.add(mesh(new THREE.BoxGeometry(8.3, 0.34, 1.05), darkMat, [0, 4.62, 0]));
  gate.add(createSceneLabel('FESTIVAL GATE', '#f7e7b2', '#6f1d18', 3.8, 0.7, [0, 3.35, -0.46]));
  gate.position.set(0, 0, 24.8);
  gate.traverse(enableShadows);
  scene.add(gate);

  const shopNames = ['RAMEN', 'SKEWERS', 'SWEETS', 'TEA'];
  [-18, -6, 6, 18].forEach((x, index) => {
    const front = new THREE.Group();
    front.add(mesh(new THREE.BoxGeometry(5.0, 2.5, 0.42), woodMat, [0, 1.25, 0]));
    front.add(mesh(new THREE.BoxGeometry(5.6, 0.32, 1.0), darkMat, [0, 2.68, -0.1]));
    front.add(createSceneLabel(shopNames[index], '#fff0b8', index % 2 ? '#365c49' : '#7a2d24', 3.3, 0.72, [0, 2.02, -0.25]));
    front.position.set(x, 0, -25.1);
    front.traverse(enableShadows);
    scene.add(front);
  });

  [-17, -10, -3, 4, 11, 18].forEach((x, index) => {
    const banner = new THREE.Group();
    banner.add(mesh(new THREE.BoxGeometry(0.08, 2.6, 0.08), darkMat, [-0.65, 1.3, 0]));
    banner.add(mesh(new THREE.BoxGeometry(0.08, 2.6, 0.08), darkMat, [0.65, 1.3, 0]));
    banner.add(mesh(new THREE.BoxGeometry(1.28, 1.55, 0.08), clothMat, [0, 1.75, 0]));
    banner.position.set(x, 0, -3.65 + (index % 2) * 7.3);
    banner.rotation.y = index % 2 ? Math.PI / 2 : 0;
    banner.traverse(enableShadows);
    scene.add(banner);
  });
}

function createFoodStand(arena, bodyMat, roofMat, index) {
  const group = new THREE.Group();
  const trimMat = new THREE.MeshStandardMaterial({
    color: index % 2 ? '#d94c45' : '#e7c46a',
    roughness: 0.58,
    emissive: index % 2 ? '#2a0503' : '#2a2105',
    emissiveIntensity: 0.25
  });
  group.add(mesh(new THREE.BoxGeometry(4.8, 1.55, 2.4), bodyMat, [0, 0.78, 0]));
  group.add(mesh(new THREE.BoxGeometry(5.5, 0.3, 3.1), roofMat, [0, 1.85, 0]));
  group.add(mesh(new THREE.BoxGeometry(5.2, 0.26, 0.18), trimMat, [0, 2.05, -1.42]));
  group.add(mesh(new THREE.BoxGeometry(4.2, 0.22, 0.28), trimMat, [0, 1.28, -1.36]));
  group.add(mesh(new THREE.BoxGeometry(1.0, 0.9, 0.16), trimMat, [-1.45, 1.05, -1.43]));
  group.add(mesh(new THREE.BoxGeometry(1.0, 0.9, 0.16), trimMat, [1.45, 1.05, -1.43]));
  for (let i = -2; i <= 2; i++) {
    group.add(createLanternMesh(arena, [i * 0.78, 2.28, -1.48], 0.42));
  }
  for (let i = -1; i <= 1; i++) {
    const box = createPropMesh(getArena().props[(index + i + 6) % getArena().props.length], arena, false);
    box.position.set(i * 1.18, 0, -2.16);
    box.scale.multiplyScalar(0.62);
    group.add(box);
  }
  spawnAsset(`${CITY}${index % 2 ? 'detail-awning-wide.glb' : 'detail-awning.glb'}`, [0, 1.78, -1.55], 1.7, [0, 0, 0], group);
  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return group;
}

function createCounterWithFood(index) {
  const group = new THREE.Group();
  const counterMat = new THREE.MeshStandardMaterial({ color: index % 2 ? '#8b5f3e' : '#bd7740', roughness: 0.72 });
  const trayMat = new THREE.MeshStandardMaterial({ color: '#25252a', roughness: 0.65 });
  group.add(mesh(new THREE.BoxGeometry(3.2, 0.85, 1.4), counterMat, [0, 0, 0]));
  for (let i = -1; i <= 1; i++) {
    group.add(mesh(new THREE.BoxGeometry(0.84, 0.08, 0.56), trayMat, [i * 0.92, 0.5, -0.16]));
    const foodFile = FESTIVAL_FOOD_ITEMS[(index * 3 + i + 1 + FESTIVAL_FOOD_ITEMS.length) % FESTIVAL_FOOD_ITEMS.length];
    spawnAsset(`${FOOD}${foodFile}`, [i * 0.92, 0.58, -0.2], foodScaleFor(foodFile), [0, (index + i) * 0.7, 0], group);
  }
  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return group;
}

function createTableUmbrella(arena, canopyColor = '#3eb076') {
  const group = new THREE.Group();
  const poleMat = new THREE.MeshStandardMaterial({ color: '#2a2420', roughness: 0.72 });
  const canopyMat = new THREE.MeshStandardMaterial({
    color: canopyColor,
    roughness: 0.82,
    emissive: canopyColor,
    emissiveIntensity: 0.06
  });
  const trimMat = new THREE.MeshStandardMaterial({ color: '#f0dfaa', roughness: 0.74 });

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.25, 10), poleMat);
  pole.position.y = 1.12;
  group.add(pole);

  const canopy = new THREE.Mesh(new THREE.ConeGeometry(0.86, 0.36, 8), canopyMat);
  canopy.position.y = 2.32;
  canopy.rotation.y = Math.PI / 8;
  group.add(canopy);

  const trim = new THREE.Mesh(new THREE.TorusGeometry(0.69, 0.018, 6, 8), trimMat);
  trim.position.y = 2.14;
  trim.rotation.x = Math.PI / 2;
  group.add(trim);

  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.08, 10), trimMat);
  foot.position.y = 0.04;
  group.add(foot);

  group.traverse(enableShadows);
  return group;
}

function foodScaleFor(file) {
  if (file.includes('burger') || file.includes('pizza') || file.includes('pancakes')) return 0.95;
  if (file.includes('fries') || file.includes('cup') || file.includes('carton')) return 1.25;
  if (file.includes('sushi') || file.includes('maki') || file.includes('dim-sum')) return 1.45;
  if (file.includes('skewer') || file.includes('hot-dog') || file.includes('corn-dog')) return 1.15;
  if (file.includes('banana') || file.includes('apple') || file.includes('donut')) return 1.25;
  return 1.0;
}

function createLanternMesh(arena, position, scale = 1) {
  const group = new THREE.Group();
  const glow = new THREE.MeshStandardMaterial({
    color: arena.accent,
    emissive: arena.accent,
    emissiveIntensity: 0.75,
    roughness: 0.42
  });
  const rim = new THREE.MeshStandardMaterial({ color: '#1f252b', roughness: 0.7 });
  group.add(mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.42, 12), glow, [0, 0, 0]));
  group.add(mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 12), rim, [0, 0.23, 0]));
  group.add(mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 12), rim, [0, -0.23, 0]));
  group.position.set(position[0], position[1], position[2]);
  group.scale.setScalar(scale);
  return group;
}

function addLanternStrings(arena) {
  const cordMat = new THREE.MeshStandardMaterial({ color: '#181b20', roughness: 0.8 });
  const runs = [
    [-21, -4, -10, -4],
    [-10, -4, 2, -4],
    [2, -4, 20, -4],
    [-18, 8, -2, 8],
    [2, 8, 20, 8]
  ];
  runs.forEach(([x1, z1, x2, z2], runIndex) => {
    const midX = (x1 + x2) / 2;
    const midZ = (z1 + z2) / 2;
    const length = Math.hypot(x2 - x1, z2 - z1);
    const cord = new THREE.Mesh(new THREE.BoxGeometry(length, 0.04, 0.04), cordMat);
    cord.position.set(midX, 2.9, midZ);
    cord.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
    scene.add(cord);
    const count = Math.max(3, Math.floor(length / 3.5));
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const x = THREE.MathUtils.lerp(x1, x2, t);
      const z = THREE.MathUtils.lerp(z1, z2, t);
      scene.add(createLanternMesh(arena, [x, 2.58 + Math.sin((i + runIndex) * 0.8) * 0.08, z], 0.72));
    }
  });
}

function addFestivalCrateLanes(arena) {
  const zones = [
    [-15, -7, 5, 0],
    [15, 6, 5, Math.PI],
    [-7, 17, 4, Math.PI / 2],
    [8, -16, 4, -Math.PI / 2]
  ];
  zones.forEach(([x, z, count, ry], zoneIndex) => {
    for (let i = 0; i < count; i++) {
      const def = arena.props[(i + zoneIndex) % arena.props.length];
      const prop = createPropMesh(def, arena, false);
      prop.position.set(x + (i % 2) * 1.4, 0, z + Math.floor(i / 2) * 1.25);
      prop.rotation.y = ry + i * 0.34;
      prop.scale.multiplyScalar(0.78);
      scene.add(prop);
    }
  });
  const sampleBars = [
    [-13.5, 10.8, 0],
    [-0.5, 11.2, 4],
    [12.5, 10.8, 8],
    [-14.5, -10.8, 2],
    [13.0, -10.6, 6]
  ];
  sampleBars.forEach(([x, z, offset], index) => {
    const display = createFoodSampleTable(index);
    display.position.set(x + 1.24, 0, z + 0.1);
    scene.add(display);
    for (let i = 0; i < 5; i++) {
      const file = FESTIVAL_FOOD_ITEMS[(offset + i) % FESTIVAL_FOOD_ITEMS.length];
      spawnAsset(`${FOOD}${file}`, [-1.24 + i * 0.62, 0.72, -0.1 + (i % 2) * 0.22], foodScaleFor(file) * 0.72, [0, i * 0.8, 0], display);
    }
  });
}

function createFoodSampleTable(index = 0) {
  const group = new THREE.Group();
  const topMat = new THREE.MeshStandardMaterial({ color: index % 2 ? '#7c4f32' : '#9a5f32', roughness: 0.74 });
  const legMat = new THREE.MeshStandardMaterial({ color: '#2a2420', roughness: 0.72 });
  group.add(mesh(new THREE.BoxGeometry(3.3, 0.16, 0.78), topMat, [0, 0.48, 0]));
  group.add(mesh(new THREE.BoxGeometry(3.45, 0.06, 0.9), new THREE.MeshStandardMaterial({ color: '#171717', roughness: 0.62 }), [0, 0.6, 0]));
  for (const x of [-1.45, 1.45]) {
    for (const z of [-0.28, 0.28]) {
      group.add(mesh(new THREE.BoxGeometry(0.08, 0.48, 0.08), legMat, [x, 0.24, z]));
    }
  }
  group.traverse(enableShadows);
  return group;
}

function addSchoolScenery(arena) {
  const wallMat = new THREE.MeshStandardMaterial({ color: '#46505f', roughness: 0.78 });
  const floorMat = new THREE.MeshStandardMaterial({ color: '#293241', roughness: 0.82 });
  const boardMat = new THREE.MeshStandardMaterial({ color: '#183a32', roughness: 0.75 });
  const woodMat = new THREE.MeshStandardMaterial({ color: '#b88d58', roughness: 0.62 });
  const paperMat = new THREE.MeshStandardMaterial({ color: '#d8d1bd', roughness: 0.9 });
  const bagMat = new THREE.MeshStandardMaterial({ color: '#62718a', roughness: 0.74 });

  const schoolFloor = new THREE.Mesh(new THREE.BoxGeometry(34, 0.08, 22), floorMat);
  schoolFloor.position.set(0, 0.06, -6);
  schoolFloor.receiveShadow = true;
  scene.add(schoolFloor);

  [
    [0, 1.55, -17, 34, 3.1, 0.5],
    [-17, 1.55, -6, 0.5, 3.1, 22],
    [17, 1.55, -6, 0.5, 3.1, 22],
    [0, 1.55, 5, 34, 3.1, 0.45]
  ].forEach(([x, y, z, sx, sy, sz]) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), wallMat);
    wall.position.set(x, y, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);
    obstacles.push(wall);
  });

  const board = new THREE.Mesh(new THREE.BoxGeometry(8, 2, 0.12), boardMat);
  board.position.set(0, 1.95, -16.72);
  scene.add(board);

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const x = -10 + col * 5;
      const z = -12.5 + row * 3.45;
      const desk = createDeskSet(woodMat, wallMat);
      desk.rotation.y = (row % 2 ? 0.05 : -0.04) + (col % 2) * 0.06;
      desk.position.set(x, 0, z);
      scene.add(desk);
      if ((row + col) % 2 === 0) {
        const bag = createSchoolBag(bagMat, (row + col) % 4);
        bag.position.set(x + 1.25, 0, z + 0.85);
        scene.add(bag);
      }
      if ((row + col) % 3 === 0) {
        const stack = createBookStack(paperMat, row + col);
        stack.position.set(x - 0.42, 0.96, z - 0.24);
        scene.add(stack);
      }
    }
  }

  for (let i = 0; i < 9; i++) {
    const locker = createPropMesh(getArena().props[2], arena, false);
    locker.position.set(-16.55, 0, -15 + i * 2.35);
    locker.rotation.y = Math.PI / 2;
    locker.scale.multiplyScalar(0.82);
    scene.add(locker);
  }
  for (let i = 0; i < 8; i++) {
    const locker = createPropMesh(getArena().props[2], arena, false);
    locker.position.set(16.55, 0, -14 + i * 2.3);
    locker.rotation.y = -Math.PI / 2;
    locker.scale.multiplyScalar(0.82);
    scene.add(locker);
  }

  [-12, -6, 6, 12].forEach((x, index) => {
    const shelf = createBookshelf(woodMat, paperMat, index);
    shelf.position.set(x, 0, 4.15);
    shelf.rotation.y = Math.PI;
    scene.add(shelf);
  });

  const teacherDesk = createTeacherDesk(woodMat, wallMat, paperMat);
  teacherDesk.position.set(9.8, 0, -15.25);
  teacherDesk.rotation.y = Math.PI;
  scene.add(teacherDesk);

  for (let i = 0; i < 10; i++) {
    const poster = new THREE.Mesh(
      new THREE.BoxGeometry(1.2 + (i % 3) * 0.25, 0.85, 0.04),
      new THREE.MeshStandardMaterial({
        color: ['#d8d1bd', '#74d6c5', '#e7c46a', '#d96d66'][i % 4],
        roughness: 0.88
      })
    );
    poster.position.set(-12 + i * 2.7, 2.1, -16.42);
    scene.add(poster);
  }

  [
    [-11, 0, 13, 0], [-4, 0, 14, 0.3], [4, 0, 13.4, -0.2], [11, 0, 14.2, 0.1]
  ].forEach(([x, y, z, r]) => spawnAsset(`${ROADS}construction-cone.glb`, [x, y, z], 1.4, [0, r, 0]));

  addSchoolLandmarks(arena, woodMat, wallMat, paperMat);
  addSchoolCeilingAndWindows(arena);
  addSchoolGuidanceDetails(arena);

  patrolPoints = [
    new THREE.Vector3(-13, 0, -14),
    new THREE.Vector3(13, 0, -14),
    new THREE.Vector3(13, 0, 2),
    new THREE.Vector3(-13, 0, 2),
    new THREE.Vector3(0, 0, 14)
  ];
}

function addSchoolGuidanceDetails(arena) {
  const arrowMat = new THREE.MeshStandardMaterial({ color: '#e7c46a', emissive: '#2a2105', emissiveIntensity: 0.28, roughness: 0.62 });
  const safeMat = new THREE.MeshStandardMaterial({ color: '#74d6c5', emissive: '#11332d', emissiveIntensity: 0.25, roughness: 0.62 });
  const darkMat = new THREE.MeshStandardMaterial({ color: '#20242b', roughness: 0.8 });

  [
    ['LOCKERS', -16.46, 2.72, -6, Math.PI / 2],
    ['SHELVES', 0, 2.72, 4.72, Math.PI],
    ['CLEANING', -12.5, 1.58, 10.7, -0.05],
    ['LOST ITEMS', 10.8, 1.55, 10.7, 0.05]
  ].forEach(([text, x, y, z, ry]) => {
    const label = createSceneLabel(text, '#e9e0c8', '#25313d', 2.7, 0.45, [0, 0, 0]);
    label.position.set(x, y, z);
    label.rotation.y = ry;
    scene.add(label);
  });

  for (let i = 0; i < 5; i++) {
    const arrow = new THREE.Group();
    arrow.add(mesh(new THREE.BoxGeometry(1.4, 0.04, 0.18), arrowMat, [0, 0, 0]));
    arrow.add(mesh(new THREE.ConeGeometry(0.26, 0.46, 3), arrowMat, [0.82, 0, 0], [0, 0, -Math.PI / 2]));
    arrow.position.set(-10 + i * 5, 0.15, 8.0);
    arrow.rotation.y = i % 2 ? 0 : Math.PI;
    scene.add(arrow);
  }

  for (let i = 0; i < 8; i++) {
    const mat = i % 2 ? safeMat : darkMat;
    const divider = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.25, 1.9), mat);
    divider.position.set(-13.8 + i * 3.9, 0.72, 4.75);
    divider.castShadow = true;
    divider.receiveShadow = true;
    scene.add(divider);
  }
}

function addSchoolCeilingAndWindows(arena) {
  const lightMat = new THREE.MeshStandardMaterial({
    color: '#dff7ff',
    emissive: '#9bdff0',
    emissiveIntensity: 0.55,
    roughness: 0.35
  });
  const frameMat = new THREE.MeshStandardMaterial({ color: '#1f252d', roughness: 0.72 });
  const glassMat = new THREE.MeshStandardMaterial({
    color: '#7da2b8',
    emissive: '#203748',
    emissiveIntensity: 0.2,
    roughness: 0.18,
    transparent: true,
    opacity: 0.58
  });

  for (let x = -12; x <= 12; x += 8) {
    for (let z = -12; z <= 0; z += 6) {
      const light = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 0.72), lightMat);
      light.position.set(x, 3.08, z);
      scene.add(light);
      const point = new THREE.PointLight('#bdefff', 0.45, 8, 2.2);
      point.position.set(x, 2.8, z);
      scene.add(point);
    }
  }

  for (let i = 0; i < 6; i++) {
    const windowGroup = new THREE.Group();
    windowGroup.add(mesh(new THREE.BoxGeometry(1.8, 1.15, 0.08), glassMat, [0, 0, 0]));
    windowGroup.add(mesh(new THREE.BoxGeometry(1.96, 0.08, 0.12), frameMat, [0, 0.62, -0.02]));
    windowGroup.add(mesh(new THREE.BoxGeometry(1.96, 0.08, 0.12), frameMat, [0, -0.62, -0.02]));
    windowGroup.add(mesh(new THREE.BoxGeometry(0.08, 1.24, 0.12), frameMat, [-0.98, 0, -0.02]));
    windowGroup.add(mesh(new THREE.BoxGeometry(0.08, 1.24, 0.12), frameMat, [0.98, 0, -0.02]));
    windowGroup.position.set(-16.72, 2.0, -13.5 + i * 3.1);
    windowGroup.rotation.y = Math.PI / 2;
    scene.add(windowGroup);
  }
}

function addSchoolLandmarks(arena, woodMat, wallMat, paperMat) {
  const darkMat = new THREE.MeshStandardMaterial({ color: '#1f252d', roughness: 0.8 });
  const cleanMat = new THREE.MeshStandardMaterial({ color: '#6fa0a8', roughness: 0.72 });
  scene.add(createSceneLabel('SCIENCE 2-B', '#e9e0c8', '#26313c', 4.1, 0.78, [0, 2.98, -16.38]));

  const clock = new THREE.Group();
  clock.add(mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.08, 24), new THREE.MeshStandardMaterial({ color: '#e8e0d0', roughness: 0.7 }), [0, 0, 0], [Math.PI / 2, 0, 0]));
  clock.add(mesh(new THREE.BoxGeometry(0.04, 0.34, 0.035), darkMat, [0, 0.06, -0.04], [0, 0, 0.2]));
  clock.add(mesh(new THREE.BoxGeometry(0.04, 0.26, 0.035), darkMat, [0.08, -0.02, -0.04], [0, 0, -0.9]));
  clock.position.set(-12.4, 2.55, -16.35);
  scene.add(clock);

  const cleaning = new THREE.Group();
  cleaning.add(mesh(new THREE.BoxGeometry(1.9, 0.82, 0.9), cleanMat, [0, 0.42, 0]));
  cleaning.add(mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.7, 10), darkMat, [-0.65, 1.05, 0.18], [0.28, 0, -0.32]));
  cleaning.add(mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.7, 10), darkMat, [-0.32, 1.03, 0.15], [0.18, 0, 0.28]));
  cleaning.add(createSchoolBag(new THREE.MeshStandardMaterial({ color: '#7b5546', roughness: 0.78 }), 2));
  cleaning.position.set(-12.7, 0, 12.0);
  cleaning.traverse(enableShadows);
  scene.add(cleaning);

  const lostFound = new THREE.Group();
  lostFound.add(mesh(new THREE.BoxGeometry(3.2, 0.75, 1.1), woodMat, [0, 0.38, 0]));
  lostFound.add(createSceneLabel('LOST & FOUND', '#1f252d', '#d8d1bd', 2.5, 0.42, [0, 0.94, -0.58]));
  for (let i = -1; i <= 1; i++) {
    const bag = createSchoolBag(new THREE.MeshStandardMaterial({ color: ['#62718a', '#9a6f55', '#6d8a66'][i + 1], roughness: 0.76 }), i + 3);
    bag.position.set(i * 0.72, 0.78, 0.05);
    lostFound.add(bag);
  }
  lostFound.position.set(10.8, 0, 11.9);
  lostFound.rotation.y = -0.08;
  lostFound.traverse(enableShadows);
  scene.add(lostFound);
}

function createBookshelf(woodMat, paperMat, seed = 0) {
  const group = new THREE.Group();
  const darkMat = new THREE.MeshStandardMaterial({ color: '#2b3039', roughness: 0.8 });
  group.add(mesh(new THREE.BoxGeometry(2.4, 2.25, 0.42), woodMat, [0, 1.12, 0]));
  for (let shelf = 0; shelf < 4; shelf++) {
    group.add(mesh(new THREE.BoxGeometry(2.55, 0.08, 0.5), darkMat, [0, 0.42 + shelf * 0.48, -0.02]));
    for (let i = 0; i < 7; i++) {
      const color = ['#d8d1bd', '#74d6c5', '#e7c46a', '#d96d66', '#8db7d8'][(i + shelf + seed) % 5];
      const bookMat = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
      group.add(mesh(
        new THREE.BoxGeometry(0.16, 0.32 + ((i + seed) % 3) * 0.08, 0.16),
        bookMat,
        [-0.92 + i * 0.3, 0.62 + shelf * 0.48, -0.28]
      ));
    }
  }
  group.add(mesh(new THREE.BoxGeometry(0.55, 0.36, 0.32), paperMat, [0.72, 1.85, -0.24]));
  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return group;
}

function createBookStack(paperMat, seed = 0) {
  const group = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const mat = new THREE.MeshStandardMaterial({
      color: ['#d8d1bd', '#d96d66', '#74d6c5', '#e7c46a'][(i + seed) % 4],
      roughness: 0.84
    });
    group.add(mesh(new THREE.BoxGeometry(0.62, 0.06, 0.42), mat, [0.02 * i, i * 0.07, 0.02 * (i % 2)]));
  }
  return group;
}

function createSchoolBag(material, seed = 0) {
  const group = new THREE.Group();
  const strapMat = new THREE.MeshStandardMaterial({ color: '#20242b', roughness: 0.75 });
  group.add(mesh(new THREE.BoxGeometry(0.58, 0.62, 0.32), material, [0, 0.34, 0]));
  group.add(mesh(new THREE.BoxGeometry(0.48, 0.12, 0.36), material, [0, 0.7, 0]));
  group.add(mesh(new THREE.BoxGeometry(0.08, 0.56, 0.05), strapMat, [-0.21, 0.34, -0.18]));
  group.add(mesh(new THREE.BoxGeometry(0.08, 0.56, 0.05), strapMat, [0.21, 0.34, -0.18]));
  group.rotation.y = seed * 0.7;
  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return group;
}

function createTeacherDesk(woodMat, metalMat, paperMat) {
  const group = new THREE.Group();
  group.add(mesh(new THREE.BoxGeometry(3.6, 0.18, 1.45), woodMat, [0, 0.88, 0]));
  group.add(mesh(new THREE.BoxGeometry(3.5, 0.9, 0.18), woodMat, [0, 0.43, -0.58]));
  group.add(mesh(new THREE.BoxGeometry(0.14, 0.82, 1.2), metalMat, [-1.55, 0.44, 0]));
  group.add(mesh(new THREE.BoxGeometry(0.14, 0.82, 1.2), metalMat, [1.55, 0.44, 0]));
  for (let i = -1; i <= 1; i++) {
    const stack = createBookStack(paperMat, i + 4);
    stack.position.set(i * 0.72, 1.02, -0.16);
    group.add(stack);
  }
  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return group;
}

function addArcadeScenery(arena) {
  const neon = new THREE.Color(arena.accent);
  const darkMat = new THREE.MeshStandardMaterial({ color: '#1b1c31', roughness: 0.7 });
  const glowMat = new THREE.MeshStandardMaterial({ color: neon, emissive: neon, emissiveIntensity: 0.9, roughness: 0.4 });
  const carpet = new THREE.Mesh(new THREE.BoxGeometry(44, 0.08, 32), new THREE.MeshStandardMaterial({ color: '#2d2648', roughness: 0.9 }));
  carpet.position.set(0, 0.05, 0);
  carpet.receiveShadow = true;
  scene.add(carpet);

  [
    ['building-j.glb', -22, 0, -12, 0.55, Math.PI / 2],
    ['building-k.glb', 22, 0, -10, 0.55, -Math.PI / 2],
    ['building-l.glb', -22, 0, 10, 0.52, Math.PI / 2],
    ['building-m.glb', 22, 0, 12, 0.52, -Math.PI / 2],
    ['building-n.glb', 0, 0, -24, 0.62, 0]
  ].forEach(([file, x, y, z, s, ry]) => spawnAsset(`${CITY}${file}`, [x, y, z], s, [0, ry, 0]));

  for (let i = -18; i <= 18; i += 6) {
    const sign = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.0, 0.16), glowMat);
    sign.position.set(i, 2.1, -17.8);
    sign.castShadow = true;
    scene.add(sign);

    const cabinet = createArcadeCabinet(darkMat, glowMat, i % 3);
    cabinet.position.set(i, 0, 12 + (Math.abs(i) % 2) * 3);
    cabinet.rotation.y = Math.PI + (i % 2) * 0.16;
    scene.add(cabinet);
    obstacles.push(cabinet);
  }

  for (let i = 0; i < 7; i++) {
    spawnAsset(`${ROADS}${i % 2 ? 'light-square.glb' : 'light-square-double.glb'}`, [-18 + i * 6, 0, 0], 1.25, [0, i * 0.7, 0]);
  }

  addArcadeLandmarks(arena, darkMat, glowMat);
  addArcadeMachineRows(arena, darkMat, glowMat);
  addArcadeAttractMode(arena);

  patrolPoints = [
    new THREE.Vector3(-20, 0, -18),
    new THREE.Vector3(20, 0, -18),
    new THREE.Vector3(20, 0, 18),
    new THREE.Vector3(-20, 0, 18),
    new THREE.Vector3(0, 0, 0)
  ];
}

function addArcadeAttractMode(arena) {
  const colors = ['#ff6eb6', '#74d6c5', '#e7c46a', '#8db7d8'];
  for (let i = 0; i < 10; i++) {
    const color = colors[i % colors.length];
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.8,
      roughness: 0.36
    });
    const sign = createSceneLabel(i % 2 ? 'PLAY' : 'WIN', '#11151c', color, 1.5, 0.48, [0, 0, 0]);
    sign.position.set(-18 + i * 4, 2.85, i % 2 ? -12.6 : 10.6);
    sign.rotation.y = i % 2 ? 0 : Math.PI;
    scene.add(sign);

    const floorDot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.04, 18), mat);
    floorDot.position.set(-18 + i * 4, 0.16, i % 2 ? -5.6 : 5.8);
    scene.add(floorDot);
  }
}

function addArcadeMachineRows(arena, darkMat, glowMat) {
  const rows = [
    [-15, -9, 4, 0],
    [15, -9, 4, Math.PI],
    [-15, 7, 4, 0],
    [15, 7, 4, Math.PI]
  ];
  rows.forEach(([x, z, count, ry], rowIndex) => {
    for (let i = 0; i < count; i++) {
      const cab = createArcadeCabinet(darkMat, glowMat, i + rowIndex);
      cab.position.set(x + (rowIndex % 2 ? -i * 2.6 : i * 2.6), 0, z);
      cab.rotation.y = ry;
      cab.scale.setScalar(0.86);
      scene.add(cab);
    }
  });

  const vendingMat = new THREE.MeshStandardMaterial({ color: '#29304d', roughness: 0.68 });
  const screenMat = new THREE.MeshStandardMaterial({ color: '#74d6c5', emissive: '#74d6c5', emissiveIntensity: 0.9, roughness: 0.35 });
  [-20, 20].forEach((x, side) => {
    for (let i = 0; i < 4; i++) {
      const vm = new THREE.Group();
      vm.add(mesh(new THREE.BoxGeometry(1.25, 2.25, 0.82), vendingMat, [0, 1.12, 0]));
      vm.add(mesh(new THREE.BoxGeometry(0.82, 1.25, 0.08), screenMat, [0, 1.36, -0.44]));
      vm.add(mesh(new THREE.BoxGeometry(0.22, 0.58, 0.09), new THREE.MeshStandardMaterial({ color: '#11151c', roughness: 0.55 }), [0.46, 0.86, -0.45]));
      vm.position.set(x, 0, -5 + i * 3.4);
      vm.rotation.y = side ? -Math.PI / 2 : Math.PI / 2;
      vm.traverse(enableShadows);
      scene.add(vm);
    }
  });
}

function addArcadeLandmarks(arena, darkMat, glowMat) {
  const prizeMat = new THREE.MeshStandardMaterial({ color: '#5b487d', roughness: 0.72 });
  const capsuleMats = ['#ff6eb6', '#74d6c5', '#e7c46a', '#8db7d8'].map(color => new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.2,
    roughness: 0.62
  }));

  const entry = new THREE.Group();
  entry.add(mesh(new THREE.BoxGeometry(9.8, 0.38, 0.5), glowMat, [0, 3.35, 0]));
  entry.add(mesh(new THREE.BoxGeometry(0.45, 3.2, 0.45), glowMat, [-4.9, 1.6, 0]));
  entry.add(mesh(new THREE.BoxGeometry(0.45, 3.2, 0.45), glowMat, [4.9, 1.6, 0]));
  entry.add(createSceneLabel('NEON ARCADE', '#1a1830', '#80fff2', 5.8, 0.86, [0, 2.55, -0.32]));
  entry.position.set(0, 0, -24.2);
  entry.traverse(enableShadows);
  scene.add(entry);

  const prizeCounter = new THREE.Group();
  prizeCounter.add(mesh(new THREE.BoxGeometry(8.8, 1.1, 1.5), prizeMat, [0, 0.55, 0]));
  prizeCounter.add(createSceneLabel('PRIZES', '#ffffff', '#7c2d75', 3.0, 0.64, [0, 1.32, -0.78]));
  for (let i = 0; i < 10; i++) {
    const toy = new THREE.Mesh(
      i % 2 ? new THREE.BoxGeometry(0.44, 0.44, 0.44) : new THREE.SphereGeometry(0.25, 12, 8),
      capsuleMats[i % capsuleMats.length]
    );
    toy.position.set(-3.8 + i * 0.84, 1.18 + (i % 2) * 0.12, -0.25 + (i % 3) * 0.22);
    toy.castShadow = true;
    prizeCounter.add(toy);
  }
  prizeCounter.position.set(0, 0, 18.5);
  scene.add(prizeCounter);

  for (let groupIndex = 0; groupIndex < 3; groupIndex++) {
    const cluster = new THREE.Group();
    for (let i = 0; i < 9; i++) {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), capsuleMats[(i + groupIndex) % capsuleMats.length]);
      cap.position.set((i % 3) * 0.52, 0.2 + Math.floor(i / 3) * 0.34, Math.floor(i / 3) * 0.42);
      cap.castShadow = true;
      cluster.add(cap);
    }
    cluster.position.set(-18 + groupIndex * 18, 0, 6.5);
    scene.add(cluster);
  }
}

function createDeskSet(woodMat, metalMat) {
  const group = new THREE.Group();
  group.add(mesh(new THREE.BoxGeometry(2.0, 0.16, 1.25), woodMat, [0, 0.8, 0]));
  for (const x of [-0.78, 0.78]) for (const z of [-0.46, 0.46]) {
    group.add(mesh(new THREE.BoxGeometry(0.12, 0.78, 0.12), metalMat, [x, 0.4, z]));
  }
  group.add(mesh(new THREE.BoxGeometry(1.0, 0.16, 0.95), woodMat, [0, 0.48, 1.15]));
  group.add(mesh(new THREE.BoxGeometry(1.0, 0.82, 0.14), woodMat, [0, 0.95, 1.58]));
  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return group;
}

function createArcadeCabinet(bodyMat, glowMat, variant = 0) {
  const group = new THREE.Group();
  const accent = variant === 0 ? '#74d6c5' : variant === 1 ? '#ff6eb6' : '#e7c46a';
  const screenMat = new THREE.MeshStandardMaterial({
    color: accent,
    emissive: accent,
    emissiveIntensity: 1.3,
    roughness: 0.35
  });
  group.add(mesh(new THREE.BoxGeometry(1.6, 2.2, 1.0), bodyMat, [0, 1.1, 0]));
  group.add(mesh(new THREE.BoxGeometry(1.25, 0.82, 0.08), screenMat, [0, 1.45, -0.54]));
  group.add(mesh(new THREE.BoxGeometry(1.45, 0.24, 0.7), glowMat, [0, 0.78, -0.28], [-0.25, 0, 0]));
  group.add(mesh(new THREE.BoxGeometry(1.8, 0.32, 1.15), bodyMat, [0, 0.16, 0]));
  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return group;
}

function addProps(arena) {
  const placements = getArenaPropPlacements(arena);

  placements.forEach((placement, index) => {
    const def = arena.props[index % arena.props.length];
    const mesh = createPropMesh(def, arena, false);
    mesh.position.set(placement[0], 0, placement[1]);
    mesh.rotation.y = placement[2] * Math.PI;
    mesh.userData.baseY = mesh.position.y;
    scene.add(mesh);
    props.push({ mesh, def, fake: false, caught: false, originalColor: captureMaterialState(mesh) });
  });
}

function getArenaPropPlacements(arena) {
  if (arena.id === 'school') {
    // Shifted away from desks/lockers to corridor edges & corners
    return [
      [-14.2, -13.5, 0.5], [-13.1, -10.8, -0.2], [-14.4, -8.1, 0.2], [-13.0, -5.2, 0.1],
      [14.1, -12.2, -0.4], [13.2, -8.8, 0.3], [14.3, -5.7, -0.1], [13.0, -2.8, 0.2],
      [-10.8, -14.2, 0.2], [-6.2, -14.0, -0.4], [-1.3, -14.1, 0.3], [3.7, -13.8, -0.2], [8.4, -14.0, 0.5],
      [-11.2, -9.7, -0.2], [-6.0, -8.9, 0.1], [-1.4, -9.4, -0.6], [3.8, -9.0, 0.4], [8.5, -9.2, -0.1],
      [-11.0, -5.5, 0.4], [-6.1, -4.9, -0.2], [-1.5, -5.2, 0.6], [3.8, -4.8, -0.4], [8.2, -5.4, 0.2],
      [-11.4, -1.4, -0.1], [-6.4, -1.1, 0.5], [-1.2, -1.2, -0.3], [3.5, -1.0, 0.2], [8.4, -1.3, -0.5],
      [-12.8, 3.2, 0.2], [-8.8, 3.4, -0.3], [-4.8, 3.1, 0.1], [0.2, 3.3, -0.6], [4.6, 3.2, 0.5], [9.2, 3.5, -0.2],
      [-15.2, 1.6, 0.4], [15.3, 1.5, -0.4], [-2.8, 1.2, 0.8], [7.4, 1.1, -0.7]
    ];
  }
  if (arena.id === 'festival') {
    // Moved props away from stall positions (-19/-15, -12/-19, 13/-18, 20/-10, etc.)
    // and from counter/parasol rows (y=-7, y=7, y=11, y=13)
    return [
      [-24, -20, 0], [-23, -12, 0.4], [-17, -22, -0.2], [-13, -24, 0.8], [-8, -22, -0.5],
      [-3, -23, 0.3], [2, -22, -0.6], [7, -23, 0.7], [12, -22, -0.4], [17, -22, 0.3],
      [22, -17, -0.5], [24, -12, 0.2], [24, -5, 0.6], [24, 2, -0.1], [23, 8, 0.2],
      [22, 14, -0.3], [17, 20, 0.4], [11, 22, -0.1], [5, 23, 0.5], [-1, 22, -0.4],
      [-7, 23, 0.2], [-12, 22, -0.8], [-17, 20, 0.4], [-22, 16, -0.2], [-24, 11, 0.6],
      [-24, 5, -0.1], [-24, -1, 0.3], [-24, -7, -0.2], [-22, -4, 0.5],
      [-10, -3, 0.8], [-6, -2, 0.2], [-2, -3, -0.6], [3, -2, 0.5], [7, -3, -0.4],
      [11, -2, 0.1], [15, -3, -0.5], [-10, 4, 0.6], [-5, 4, -0.2], [0, 4, 0.4],
      [5, 4, -0.7], [10, 4, 0.3], [15, 5, -0.1], [-4, 16, 0.5], [1, 16, -0.2], [6, 16, 0.7]
    ];
  }
  // Arcade — shifted away from vending machines and arcade cabinets
  return [
    [-23, -3, 0], [-20, -6, 0.4], [-16, -2, -0.2], [-9, -21, 0.8], [-4, -21, -0.5],
    [5, -21, 0.3], [11, -22, -0.6], [23, -9, 0.6], [22, -3, -0.1], [20, 3, 0.2],
    [12, 21, 0.5], [7, 21, -0.4], [1, 22, 0.2], [-6, 21, -0.8], [-21, 9, 0.3],
    [-23, 14, -0.2], [-8, 9, 0.8], [-4, 9, 0.2], [6, 9, -0.6], [10, 9, 0.5],
    [0, -14, 0], [4, -13, 0.3], [-4, -13, -0.2], [16, 14, 0.9], [-15, 14, -0.8],
    [23, 22, 0.5], [-23, -22, 0.1], [23, -22, -0.4], [-23, 22, 0.9]
  ];
}

function createPlayer() {
  playerRoot = new THREE.Group();
  playerRoot.position.copy(getStartPosition(state.role));
  scene.add(playerRoot);

  avatarMesh = createRoleMarker('#74d6c5', 'PLAYER');
  avatarMesh.userData.isAvatarPlaceholder = true;
  playerRoot.add(avatarMesh);
}

function createPracticeActors() {
  const arena = getArena();
  seekerMesh = createSeekerMesh(arena);
  seekerMesh.position.set(-21, 0, -21);
  seekerMesh.visible = state.role === 'hider';
  scene.add(seekerMesh);

  const fakePositions = [
    [-16, 0, 2],
    [10, 0, -16],
    [19, 0, 8],
    [-7, 0, 18]
  ];
  fakePositions.forEach((pos, index) => {
    const def = arena.props[(index + 1) % arena.props.length];
    const mesh = createPropMesh(def, arena, true);
    mesh.position.set(pos[0], 0, pos[2]);
    mesh.rotation.y = (index * 0.37 + 0.2) * Math.PI;
    mesh.visible = state.role === 'seeker';
    scene.add(mesh);
    const entry = { mesh, def, fake: true, caught: false, suspicion: 0.5 + index * 0.12, originalColor: captureMaterialState(mesh) };
    fakeHiders.push(entry);
    props.push(entry);
  });
}

function createSeekerMesh(arena) {
  // Humanoid AI seeker avatar — capsule body + head + visor
  const group = new THREE.Group();
  const bodyColor = '#f05f57';
  const accentColor = arena.accent || bodyColor;
  const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.55, emissive: bodyColor, emissiveIntensity: 0.12 });
  const skinMat = new THREE.MeshStandardMaterial({ color: '#e8c9a0', roughness: 0.65 });
  const visorMat = new THREE.MeshStandardMaterial({ color: '#1a1a2e', roughness: 0.2, metalness: 0.8, emissive: '#ff2244', emissiveIntensity: 0.6 });
  const bootMat = new THREE.MeshStandardMaterial({ color: '#222', roughness: 0.7 });

  // Torso (capsule-like)
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.6, 4, 12), bodyMat);
  torso.position.y = 1.0;
  torso.castShadow = true;
  group.add(torso);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), skinMat);
  head.position.y = 1.65;
  head.castShadow = true;
  group.add(head);

  // Visor / eyes
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.1, 0.12), visorMat);
  visor.position.set(0, 1.65, -0.2);
  group.add(visor);

  // Arms
  const armGeo = new THREE.CapsuleGeometry(0.09, 0.44, 3, 8);
  const leftArm = new THREE.Mesh(armGeo, bodyMat);
  leftArm.position.set(-0.42, 1.0, 0);
  leftArm.rotation.z = 0.15;
  leftArm.castShadow = true;
  group.add(leftArm);
  const rightArm = new THREE.Mesh(armGeo, bodyMat);
  rightArm.position.set(0.42, 1.0, 0);
  rightArm.rotation.z = -0.15;
  rightArm.castShadow = true;
  group.add(rightArm);

  // Legs
  const legGeo = new THREE.CapsuleGeometry(0.11, 0.4, 3, 8);
  const leftLeg = new THREE.Mesh(legGeo, bootMat);
  leftLeg.position.set(-0.15, 0.35, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);
  const rightLeg = new THREE.Mesh(legGeo, bootMat);
  rightLeg.position.set(0.15, 0.35, 0);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  // "SEEKER" label above head
  const label = createSceneLabel('SEEKER', '#fff', '#b8312c', 1.2, 0.3, [0, 2.05, 0]);
  group.add(label);

  return group;
}

function createRoleMarker(color, labelText, accent = color) {
  const group = new THREE.Group();
  const baseMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.58,
    emissive: color,
    emissiveIntensity: 0.16
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: accent,
    roughness: 0.45,
    emissive: accent,
    emissiveIntensity: 0.45
  });
  const body = new THREE.Mesh(new THREE.OctahedronGeometry(0.58, 1), baseMat);
  body.position.y = 1.08;
  body.castShadow = true;
  group.add(body);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.035, 8, 28), accentMat);
  ring.position.y = 0.48;
  ring.rotation.x = Math.PI / 2;
  ring.castShadow = true;
  group.add(ring);

  const pointer = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.42, 3), accentMat);
  pointer.position.set(0, 1.08, -0.64);
  pointer.rotation.x = Math.PI / 2;
  pointer.castShadow = true;
  group.add(pointer);

  const label = createSceneLabel(labelText, '#11151c', color, 1.35, 0.32, [0, 1.86, 0]);
  group.add(label);
  return group;
}

function createPropMesh(def, arena, isFake) {
  const group = new THREE.Group();
  const color = new THREE.Color(isFake ? '#d9b365' : '#b7a178');
  if (arena.id === 'school') color.set(isFake ? '#8db7d8' : '#9aa6b2');
  if (arena.id === 'arcade') color.set(isFake ? '#ff86c6' : '#7a78c8');

  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.68,
    metalness: arena.id === 'arcade' ? 0.08 : 0.02
  });
  const dark = new THREE.MeshStandardMaterial({ color: '#222832', roughness: 0.8 });
  const glow = new THREE.MeshStandardMaterial({ color: arena.accent, emissive: arena.accent, emissiveIntensity: 0.45, roughness: 0.42 });

  if (def.kind === 'lantern') {
    group.add(mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.9, 16), mat, [0, 0.72, 0]));
    group.add(mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.08, 16), dark, [0, 1.2, 0]));
    group.add(mesh(new THREE.BoxGeometry(0.08, 0.9, 0.08), glow, [0, 0.72, 0]));
  } else if (def.kind === 'crate') {
    group.add(mesh(new THREE.BoxGeometry(1, 1, 1), mat, [0, 0.5, 0]));
    group.add(mesh(new THREE.BoxGeometry(1.08, 0.12, 1.08), dark, [0, 0.96, 0]));
    group.add(mesh(new THREE.BoxGeometry(0.12, 1.02, 1.1), dark, [-0.35, 0.52, 0]));
  } else if (def.kind === 'barrel') {
    group.add(mesh(new THREE.CylinderGeometry(0.48, 0.48, 1, 18), mat, [0, 0.55, 0]));
    group.add(mesh(new THREE.TorusGeometry(0.5, 0.035, 8, 18), dark, [0, 0.9, 0], [Math.PI / 2, 0, 0]));
    group.add(mesh(new THREE.TorusGeometry(0.5, 0.035, 8, 18), dark, [0, 0.25, 0], [Math.PI / 2, 0, 0]));
  } else if (def.kind === 'sign' || def.kind === 'standee') {
    group.add(mesh(new THREE.BoxGeometry(1.0, 1.25, 0.12), mat, [0, 0.95, 0]));
    group.add(mesh(new THREE.BoxGeometry(0.16, 0.85, 0.16), dark, [0, 0.35, 0]));
  } else if (def.kind === 'planter') {
    group.add(mesh(new THREE.BoxGeometry(1.1, 0.45, 0.58), mat, [0, 0.28, 0]));
    group.add(mesh(new THREE.ConeGeometry(0.36, 0.9, 9), new THREE.MeshStandardMaterial({ color: '#3c8054', roughness: 0.9 }), [-0.22, 0.95, 0]));
    group.add(mesh(new THREE.ConeGeometry(0.32, 0.8, 9), new THREE.MeshStandardMaterial({ color: '#4b9a62', roughness: 0.9 }), [0.26, 0.85, 0.05]));
  } else if (def.kind === 'tableUmbrella') {
    group.add(createTableUmbrella(arena));
  } else if (def.kind === 'chair') {
    group.add(mesh(new THREE.BoxGeometry(0.85, 0.12, 0.85), mat, [0, 0.62, 0]));
    group.add(mesh(new THREE.BoxGeometry(0.85, 0.9, 0.12), mat, [0, 1.1, 0.36]));
    for (const x of [-0.32, 0.32]) for (const z of [-0.32, 0.32]) group.add(mesh(new THREE.BoxGeometry(0.1, 0.62, 0.1), dark, [x, 0.3, z]));
  } else if (def.kind === 'desk') {
    group.add(mesh(new THREE.BoxGeometry(1.3, 0.16, 0.85), mat, [0, 0.78, 0]));
    for (const x of [-0.52, 0.52]) for (const z of [-0.3, 0.3]) group.add(mesh(new THREE.BoxGeometry(0.1, 0.72, 0.1), dark, [x, 0.37, z]));
  } else if (def.kind === 'locker' || def.kind === 'vending') {
    group.add(mesh(new THREE.BoxGeometry(0.9, 1.8, 0.62), mat, [0, 0.95, 0]));
    group.add(mesh(new THREE.BoxGeometry(0.72, 0.12, 0.04), glow, [0, 1.45, -0.33]));
    group.add(mesh(new THREE.BoxGeometry(0.1, 0.42, 0.04), dark, [0.34, 0.9, -0.33]));
  } else if (def.kind === 'cone') {
    group.add(mesh(new THREE.ConeGeometry(0.42, 0.92, 18), mat, [0, 0.46, 0]));
    group.add(mesh(new THREE.BoxGeometry(0.82, 0.08, 0.82), dark, [0, 0.05, 0]));
  } else if (def.kind === 'bucket') {
    group.add(mesh(new THREE.CylinderGeometry(0.34, 0.42, 0.58, 16), mat, [0, 0.32, 0]));
    group.add(mesh(new THREE.TorusGeometry(0.42, 0.025, 8, 16), dark, [0, 0.62, 0], [Math.PI / 2, 0, 0]));
  } else if (def.kind === 'schoolBag') {
    const bag = createSchoolBag(mat, 1);
    group.add(bag);
  } else if (def.kind === 'bookStack') {
    const books = createBookStack(mat, 2);
    books.position.set(0, 0.34, 0);
    books.scale.setScalar(1.8);
    group.add(books);
  } else if (def.kind === 'stool') {
    group.add(mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.16, 18), mat, [0, 0.68, 0]));
    group.add(mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.66, 12), dark, [0, 0.35, 0]));
  } else if (def.kind === 'capsule') {
    group.add(mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.95, 20), mat, [0, 0.75, 0]));
    group.add(mesh(new THREE.SphereGeometry(0.43, 20, 10), glow, [0, 1.25, 0]));
    group.add(mesh(new THREE.BoxGeometry(0.68, 0.42, 0.08), dark, [0, 0.76, -0.42]));
  } else if (def.kind === 'arcadeCabinet') {
    const cab = createArcadeCabinet(dark, glow, 1);
    cab.scale.setScalar(0.62);
    group.add(cab);
  }

  group.scale.set(def.scale[0], def.scale[1], def.scale[2]);
  group.userData.propDef = def;
  group.userData.isFake = isFake;
  group.userData.fallbackChildren = [...group.children];
  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  if (def.asset) {
    attachAsset(group, def.asset, def.assetScale || 1, [0, 0, 0], [0, 0, 0], true);
  }
  return group;
}

function spawnAsset(url, position, scale = 1, rotation = [0, 0, 0], parent = scene) {
  const group = new THREE.Group();
  group.position.set(position[0], position[1], position[2]);
  group.rotation.set(rotation[0], rotation[1], rotation[2]);
  group.scale.setScalar(scale);
  parent.add(group);
  attachAsset(group, url, 1, [0, 0, 0], [0, 0, 0], false);
  return group;
}

function attachAsset(parent, url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], hideFallback = false) {
  loadAssetModel(url).then(model => {
    if (hideFallback) {
      for (const child of parent.userData.fallbackChildren || []) {
        child.visible = false;
      }
    }
    const instance = model.clone(true);
    decorateLoadedModel(instance);
    instance.position.set(position[0], position[1], position[2]);
    instance.rotation.set(rotation[0], rotation[1], rotation[2]);
    instance.scale.setScalar(scale);
    parent.add(instance);
  }).catch(error => {
    console.warn(`[HideAndSeek] Asset load failed: ${url}`, error?.message || error);
  });
}

function loadAssetModel(url) {
  if (modelCache.has(url)) return modelCache.get(url);
  const promise = new Promise((resolve, reject) => {
    gltfLoader.load(url, gltf => {
      const root = gltf.scene;
      decorateLoadedModel(root);
      resolve(root);
    }, undefined, reject);
  });
  modelCache.set(url, promise);
  return promise;
}

function decorateLoadedModel(root) {
  root.traverse(child => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;
    if (child.material) {
      child.material = child.material.clone();
      child.material.roughness = Math.max(child.material.roughness ?? 0.7, 0.55);
    }
  });
}

function createSceneLabel(text, textColor, backgroundColor, width, height, position) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 10;
  ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);
  ctx.fillStyle = textColor;
  ctx.font = 'bold 54px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const label = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  label.position.set(position[0], position[1], position[2]);
  return label;
}

function enableShadows(child) {
  if (!child.isMesh) return;
  child.castShadow = true;
  child.receiveShadow = true;
}

function mesh(geometry, material, position, rotation = [0, 0, 0]) {
  const m = new THREE.Mesh(geometry, material);
  m.position.set(position[0], position[1], position[2]);
  m.rotation.set(rotation[0], rotation[1], rotation[2]);
  return m;
}

function loop(time = 0) {
  requestAnimationFrame(loop);
  const dt = Math.min(lastFrameTime ? (time - lastFrameTime) / 1000 : 0, 0.08);
  lastFrameTime = time;
  update(dt);
  renderer.render(scene, camera);
}

function update(dt) {
  if (state.started && !state.caught) {
    state.timer -= dt;
    if (state.timer <= 0 && state.phase === 'hide') {
      state.phase = 'seek';
      state.timer = 150;
      setMessage('Seek phase started', state.role === 'hider' ? 'Stay believable. Movement creates tells.' : 'Find the fake props before time expires.');
    } else if (state.timer <= 0) {
      endRound();
    }
  }

  state.shield = Math.max(0, state.shield - dt);
  state.shieldCooldown = Math.max(0, state.shieldCooldown - dt);
  state.laser = Math.max(0, state.laser - dt);
  state.laserCooldown = Math.max(0, state.laserCooldown - dt);

  updatePlayer(dt);
  updateSeekerAi(dt);
  updateTargeting();
  updatePropHover();
  updateScanVisuals(dt);
  updateRemotePlayers(dt);
  broadcastPosition(dt);
  updateCamera();
  updateUi();
}

function updatePlayer(dt) {
  if (!playerRoot || state.caught) return;
  const speedBase = state.disguised ? getSelectedProp().mobility * 3.1 : 5.2;
  const speed = keys.has('ShiftLeft') || keys.has('ShiftRight') ? speedBase * 1.35 : speedBase;
  moveVec.set(0, 0, 0);

  if (keys.has('KeyW')) moveVec.z -= 1;
  if (keys.has('KeyS')) moveVec.z += 1;
  if (keys.has('KeyA')) moveVec.x -= 1;
  if (keys.has('KeyD')) moveVec.x += 1;

  if (moveVec.lengthSq() > 0) {
    moveVec.normalize();
    const sin = Math.sin(cameraYaw);
    const cos = Math.cos(cameraYaw);
    const x = moveVec.x * cos - moveVec.z * sin;
    const z = moveVec.x * sin + moveVec.z * cos;
    playerRoot.position.x += x * speed * dt;
    playerRoot.position.z += z * speed * dt;
    playerRoot.position.x = THREE.MathUtils.clamp(playerRoot.position.x, -25.5, 25.5);
    playerRoot.position.z = THREE.MathUtils.clamp(playerRoot.position.z, -25.5, 25.5);
    playerRoot.rotation.y = Math.atan2(x, z);
    if (state.disguised && playerPropMesh) {
      playerPropMesh.userData.motionTell = 1.0;
    }
  }

  if (playerPropMesh) {
    playerPropMesh.position.copy(playerRoot.position);
    playerPropMesh.rotation.y = playerRoot.rotation.y;
    playerPropMesh.visible = state.disguised;
    avatarMesh.visible = !state.disguised || state.role === 'seeker';
  }

  // Update avatar animation (idle/walk based on movement)
  const playerSpeed = moveVec.lengthSq() > 0 ? speed : 0;
  Avatar.updateAnimation(dt, playerSpeed);
}

function updateSeekerAi(dt) {
  if (!seekerMesh || state.role !== 'hider' || !state.started || state.phase !== 'seek' || state.caught) return;
  const target = patrolPoints[seekerPatrolIndex] || patrolPoints[0];
  const toTarget = tempVec.copy(target).sub(seekerMesh.position);
  toTarget.y = 0;
  if (toTarget.length() < 1.2) {
    seekerPatrolIndex = (seekerPatrolIndex + 1) % patrolPoints.length;
  } else {
    toTarget.normalize();
    seekerMesh.position.addScaledVector(toTarget, dt * 4.0);
    seekerMesh.rotation.y = Math.atan2(toTarget.x, toTarget.z);
  }

  const distance = seekerMesh.position.distanceTo(playerRoot.position);
  const shielded = state.shield > 0;
  if (distance < (shielded ? 1.15 : 2.1)) {
    state.caught = true;
    avatarMesh.visible = true;
    if (playerPropMesh) playerPropMesh.visible = false;
    endRound(false);
    return;
  }

  if (distance < 6.5 && state.disguised && Math.random() < dt * (shielded ? 0.14 : 0.5)) {
    pulseObject(playerPropMesh, shielded ? '#74d6c5' : '#f05f57', 0.35);
  }
}

function updateTargeting() {
  currentTarget = null;
  if (state.role !== 'seeker') return;

  raycaster.setFromCamera({ x: 0, y: 0 }, camera);
  const candidates = props.filter(p => p.mesh.visible && !p.caught).flatMap(p => {
    const meshes = [];
    p.mesh.traverse(child => {
      if (child.isMesh) {
        child.userData.targetEntry = p;
        meshes.push(child);
      }
    });
    return meshes;
  });

  const hits = raycaster.intersectObjects(candidates, false);
  if (hits.length) {
    currentTarget = hits[0].object.userData.targetEntry;
  }
}

function updatePropHover() {
  // Only show hover for hider when pretend is available
  const canPretend = state.role === 'hider' && (!state.started || state.phase === 'hide');
  if (!canPretend) {
    if (hoveredProp) {
      clearPropHighlight(hoveredProp);
      hoveredProp = null;
      renderer.domElement.style.cursor = '';
    }
    return;
  }

  // Raycast from current pointer position
  raycaster.setFromCamera(pointer, camera);
  const candidates = props.filter(p => p.mesh.visible && !p.caught).flatMap(p => {
    const meshes = [];
    p.mesh.traverse(child => {
      if (child.isMesh) {
        child.userData.targetEntry = p;
        meshes.push(child);
      }
    });
    return meshes;
  });

  const hits = raycaster.intersectObjects(candidates, false);
  const newHover = hits.length ? hits[0].object.userData.targetEntry : null;

  if (newHover !== hoveredProp) {
    if (hoveredProp) clearPropHighlight(hoveredProp);
    if (newHover) applyPropHighlight(newHover);
    hoveredProp = newHover;
  }

  renderer.domElement.style.cursor = hoveredProp ? 'pointer' : '';
}

function applyPropHighlight(entry) {
  entry.mesh.traverse(child => {
    if (child.isMesh && child.material) {
      const mat = child.material;
      if (!mat.userData.origEmissive) {
        mat.userData.origEmissive = mat.emissive ? mat.emissive.clone() : new THREE.Color(0);
        mat.userData.origEmissiveIntensity = mat.emissiveIntensity ?? 1;
      }
      mat.emissive = new THREE.Color(0x44aaff);
      mat.emissiveIntensity = 0.4;
    }
  });
}

function clearPropHighlight(entry) {
  entry.mesh.traverse(child => {
    if (child.isMesh && child.material) {
      const mat = child.material;
      if (mat.userData.origEmissive) {
        mat.emissive = mat.userData.origEmissive;
        mat.emissiveIntensity = mat.userData.origEmissiveIntensity;
        delete mat.userData.origEmissive;
        delete mat.userData.origEmissiveIntensity;
      }
    }
  });
}

function updateScanVisuals(dt) {
  for (let i = scanHighlights.length - 1; i >= 0; i--) {
    const item = scanHighlights[i];
    item.life -= dt;
    if (item.life <= 0) {
      restoreMaterialState(item.entry.mesh, item.entry.originalColor);
      scanHighlights.splice(i, 1);
    }
  }

  if (playerPropMesh?.userData.motionTell) {
    playerPropMesh.userData.motionTell = Math.max(0, playerPropMesh.userData.motionTell - dt * 0.7);
    if (playerPropMesh.userData.motionTell > 0.01) {
      const intensity = playerPropMesh.userData.motionTell;
      playerPropMesh.position.y = Math.sin(performance.now() * 0.02) * 0.025 * intensity;
    } else {
      playerPropMesh.position.y = 0;
    }
  }
}

function updateCamera() {
  const radius = 9;
  const height = 5.2;
  const target = tempVec.copy(playerRoot.position).add(new THREE.Vector3(0, state.disguised ? 0.8 : 1.2, 0));
  const offset = new THREE.Vector3(
    Math.sin(cameraYaw) * Math.cos(cameraPitch) * radius,
    Math.sin(cameraPitch) * height + 2.1,
    Math.cos(cameraYaw) * Math.cos(cameraPitch) * radius
  );
  camera.position.lerp(target.clone().add(offset), 0.16);
  camera.lookAt(target);
}

function handlePretendClick(event) {
  // Raycast from click position to find a prop to pretend to be
  const rect = renderer.domElement.getBoundingClientRect();
  const clickNdc = {
    x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
    y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
  };
  raycaster.setFromCamera(clickNdc, camera);
  const candidates = props.filter(p => p.mesh.visible && !p.caught).flatMap(p => {
    const meshes = [];
    p.mesh.traverse(child => {
      if (child.isMesh) {
        child.userData.targetEntry = p;
        meshes.push(child);
      }
    });
    return meshes;
  });
  const hits = raycaster.intersectObjects(candidates, false);
  if (!hits.length) return;
  const entry = hits[0].object.userData.targetEntry;
  if (!entry || !entry.def) return;
  // Find the prop index in the arena to set selectedProp
  const arena = getArena();
  const propIdx = arena.props.findIndex(p => p.id === entry.def.id);
  if (propIdx >= 0) state.selectedProp = propIdx;
  transformPlayer();
  setMessage('Pretending!', `You clicked a ${entry.def.name} and transformed into it.`);
}

function useInteract() {
  if (state.role === 'hider') {
    // Toggle disguise
    if (state.disguised) {
      undisguise();
      return;
    }
    if (state.started && state.phase !== 'hide') {
      setMessage('Transform locked', 'Prop changes are only free during the hiding phase.');
      return;
    }
    transformPlayer();
    return;
  }

  seekerTag();
}

function useTool() {
  if (!state.started) return;
  if (state.role === 'hider') {
    if (state.shieldCooldown > 0) {
      setMessage('Scan Shield cooling down', `${Math.ceil(state.shieldCooldown)} seconds remaining.`);
      return;
    }
    state.shield = 5.0;
    state.shieldCooldown = 18.0;
    state.score += 5;
    setMessage('Scan Shield active', 'Laser and AI scan confidence is reduced for a short time.');
    if (playerPropMesh) pulseObject(playerPropMesh, '#74d6c5', 0.7);
    return;
  }

  if (state.laserCooldown > 0) {
    setMessage('Laser Eyes cooling down', `${Math.ceil(state.laserCooldown)} seconds remaining.`);
    return;
  }
  state.laser = 4.0;
  state.laserCooldown = 12.0;
  runLaserScan();
}

function runLaserScan() {
  const origin = camera.position.clone();
  camera.getWorldDirection(forward);
  let suspicious = 0;
  for (const entry of props) {
    if (!entry.mesh.visible || entry.caught) continue;
    const center = getObjectCenter(entry.mesh);
    const toProp = center.sub(origin);
    const distance = toProp.length();
    if (distance > 23) continue;
    const angle = forward.angleTo(toProp.normalize());
    if (angle > 0.42) continue;
    const confidence = scanConfidence(entry, distance, angle);
    if (confidence > 0.66) {
      suspicious++;
      highlightEntry(entry, '#f05f57', 4.0);
    } else if (confidence > 0.44) {
      highlightEntry(entry, '#e7c46a', 3.0);
    } else {
      highlightEntry(entry, '#74d6c5', 2.0);
    }
  }
  setMessage('Laser Eyes sweep', suspicious ? `${suspicious} highly suspicious prop signal${suspicious === 1 ? '' : 's'} detected.` : 'No strong signal. Odd props may still be shielded or well placed.');
}

function scanConfidence(entry, distance, angle) {
  const base = entry.fake ? entry.suspicion || 0.7 : entry.def.scanSignature * 0.42;
  const distanceFactor = THREE.MathUtils.clamp(1 - distance / 28, 0.1, 1);
  const aimFactor = THREE.MathUtils.clamp(1 - angle / 0.5, 0.2, 1);
  return THREE.MathUtils.clamp(base * 0.74 + distanceFactor * 0.18 + aimFactor * 0.18, 0, 1);
}

function seekerTag() {
  if (!state.started || state.role !== 'seeker') return;
  if (!currentTarget) {
    setMessage('No prop targeted', 'Aim at a suspicious prop before inspecting.');
    return;
  }
  const distance = camera.position.distanceTo(getObjectCenter(currentTarget.mesh));
  if (distance > 18) {
    setMessage('Too far', 'Move closer before inspecting that prop.');
    return;
  }
  if (currentTarget.fake) {
    currentTarget.caught = true;
    currentTarget.mesh.visible = false;
    state.remaining = fakeHiders.filter(h => !h.caught).length;
    state.score += 25;
    setMessage('Fake prop revealed', `${currentTarget.def.name} was a hider. ${state.remaining} remaining.`);
    if (state.remaining === 0) endRound(true);
  } else {
    state.score = Math.max(0, state.score - 8);
    state.laserCooldown = Math.max(state.laserCooldown, 3);
    pulseObject(currentTarget.mesh, '#ffffff', 0.4);
    setMessage('Wrong guess', `${currentTarget.def.name} was real. Time and attention matter.`);
  }
}

function transformPlayer() {
  const arena = getArena();
  const def = getSelectedProp();
  if (playerPropMesh) {
    scene.remove(playerPropMesh);
  }
  playerPropMesh = createPropMesh(def, arena, true);
  playerPropMesh.position.copy(playerRoot.position);
  playerPropMesh.rotation.y = playerRoot.rotation.y;
  scene.add(playerPropMesh);
  state.disguised = true;
  avatarMesh.visible = false;
  playerRoot.visible = false;
  state.score += 2;
  setMessage('Disguised', `You are now a ${def.name}. Rotate with R and stay believable.`);
}

function rotateDisguise() {
  if (!state.disguised || !playerPropMesh) return;
  playerRoot.rotation.y += Math.PI / 4;
  playerPropMesh.rotation.y = playerRoot.rotation.y;
  playerPropMesh.userData.motionTell = 0.55;
}

function undisguise() {
  if (!state.disguised) return;
  if (playerPropMesh) {
    scene.remove(playerPropMesh);
    playerPropMesh = null;
  }
  state.disguised = false;
  playerRoot.visible = true;
  setMessage('Revealed', 'You are back to your avatar form.');
}

function quitGame() {
  if (!state.started) return;
  state.started = false;
  state.caught = false;
  state.disguised = false;
  if (playerPropMesh) { scene.remove(playerPropMesh); playerPropMesh = null; }
  playerRoot.visible = true;
  // Show menu, hide in-game UI
  const panel = document.querySelector('section.panel');
  if (panel) panel.style.display = '';
  const menuToggle = document.querySelector('[data-menu-toggle]');
  if (menuToggle) menuToggle.style.display = 'none';
  const quitBtn = document.querySelector('[data-quit]');
  if (quitBtn) quitBtn.style.display = 'none';
  buildArena();
  if (!Avatar.reattachAvatar(playerRoot)) {
    const authState = Auth.getAuthState();
    if (authState.isAuthenticated && authState.profile?.avatar3dUrl) {
      avatarMesh.userData.isAvatarPlaceholder = true;
      Avatar.loadAvatar(authState.profile.avatar3dUrl, playerRoot, { targetHeight: 1.7 });
    }
  }
  setMessage('Game exited', 'Choose your settings and start a new round.');
}

function endRound(seekerCleared = false) {
  if (!state.started) return;
  state.started = false;
  // Show the menu panel again when round ends
  const panel = document.querySelector('section.panel');
  if (panel) panel.style.display = '';
  const menuToggle = document.querySelector('[data-menu-toggle]');
  if (menuToggle) menuToggle.style.display = 'none';
  const quitBtn = document.querySelector('[data-quit]');
  if (quitBtn) quitBtn.style.display = 'none';
  const hiderWon = state.role === 'hider' ? !state.caught : !seekerCleared;
  if (state.role === 'hider' && hiderWon) state.score += 100;
  if (state.role === 'seeker' && seekerCleared) state.score += 100;
  const won = (state.role === 'hider' && hiderWon) || (state.role === 'seeker' && seekerCleared);
  const title = hiderWon ? 'Hiders Win!' : 'Seeker Wins!';
  const subtitle = state.role === 'hider'
    ? (state.caught ? 'You were found before time expired.' : 'You survived the round!')
    : (seekerCleared ? 'All fake props were revealed!' : 'At least one fake prop escaped.');
  showGameOverPopup(title, subtitle, won, Math.round(state.score));

  // Leaderboard upload (idempotent per match)
  const resultKey = `${state.matchId || 'local'}-${state.roundSeed}-${Date.now()}`;
  if (Auth.getAuthState().isAuthenticated && state.score > 0) {
    Leaderboard.uploadScore(state.score, resultKey);
  }

  // Broadcast round end to other players
  if (state.online && MP.getIsHost()) {
    MP.sendMessage({ type: 'ROUND_END', winner: hiderWon ? 'hider' : 'seeker', scores: { score: state.score } });
  }
}

function startRound() {
  state.started = true;
  state.phase = 'hide';
  state.timer = 45;
  state.caught = false;
  state.score = 0;
  state.remaining = 4;
  state.disguised = false;
  state.shield = 0;
  state.shieldCooldown = 0;
  state.laser = 0;
  state.laserCooldown = 0;
  state.roundSeed++;
  // Hide the menu panel once the game starts
  const panel = document.querySelector('section.panel');
  if (panel) panel.style.display = 'none';
  const menuToggle = document.querySelector('[data-menu-toggle]');
  if (menuToggle) menuToggle.style.display = '';
  const quitBtn = document.querySelector('[data-quit]');
  if (quitBtn) quitBtn.style.display = '';
  if (playerPropMesh) {
    scene.remove(playerPropMesh);
    playerPropMesh = null;
  }
  playerRoot.position.copy(getStartPosition(state.role));
  playerRoot.visible = true;
  avatarMesh.visible = true;
  buildArena();
  playerRoot.position.copy(getStartPosition(state.role));
  // Re-attach cached avatar (no network fetch)
  if (!Avatar.reattachAvatar(playerRoot)) {
    const authState = Auth.getAuthState();
    if (authState.isAuthenticated && authState.profile?.avatar3dUrl) {
      avatarMesh.userData.isAvatarPlaceholder = true;
      Avatar.loadAvatar(authState.profile.avatar3dUrl, playerRoot, { targetHeight: 1.7 });
    }
  }
  state.started = true;
  state.phase = 'hide';
  state.timer = 45;
  setMessage('Hiding phase', state.role === 'hider'
    ? 'Click any prop in the arena to pretend to be it!'
    : 'Seeker is held during hiding phase. Use this time to read the arena.');
}

function createUi() {
  const hud = document.createElement('div');
  hud.className = 'hud';
  hud.innerHTML = `
    <div class="profile-chip"></div>
    <div class="topbar">
      <div class="metric"><span>Role</span><strong data-role>Hider</strong></div>
      <div class="metric"><span>Phase</span><strong data-phase>Menu</strong></div>
      <div class="metric"><span>Timer</span><strong data-timer>0:00</strong></div>
      <div class="metric"><span>Score</span><strong data-score>0</strong></div>
      <button class="lb-toggle" data-lb-toggle>🏆</button>
      <button class="menu-toggle" data-menu-toggle style="display:none">☰</button>
    </div>
    <section class="panel">
      <h1>Hide and Seek</h1>
      <div class="field">
        <label for="arenaSelect">Arena</label>
        <select id="arenaSelect"></select>
      </div>
      <div class="field">
        <label for="roleSelect">Practice Role</label>
        <select id="roleSelect">
          <option value="hider">Hider: transform and survive</option>
          <option value="seeker">Seeker: find fake props</option>
        </select>
      </div>
      <div class="field">
        <label for="propSelect">Hider Prop</label>
        <select id="propSelect"></select>
      </div>
      <div class="button-row">
        <button data-start>Start Round (Local)</button>
        <button class="secondary" data-reset>Reset Arena</button>
      </div>
      <div class="status-list">
        <span>WASD move, drag mouse to orbit camera.</span>
        <span>Click prop to pretend, E to un-pretend, Q tool, R rotate.</span>
        <span data-target>Target: none</span>
      </div>
      <!-- Multiplayer Lobby -->
      <div class="lobby-panel">
        <h2>Online Multiplayer</h2>
        <div class="lobby-pre-room">
          <div class="button-row">
            <button data-create-room>Create Room</button>
            <button class="secondary" data-refresh-rooms>Refresh</button>
          </div>
          <ul class="room-list"><li class="room-empty">No rooms found</li></ul>
        </div>
        <div class="lobby-in-room" style="display:none">
          <div class="room-info">
            <span data-room-name></span>
            <span data-room-players></span>
          </div>
          <div class="button-row">
            <button data-start-match style="display:none">Start Match</button>
            <button class="secondary" data-leave-room>Leave Room</button>
          </div>
        </div>
      </div>
    </section>
    <div class="cooldowns">
      <div class="cooldown"><strong><span data-tool-name>Tool</span><span data-tool-time>Ready</span></strong><div class="bar"><i data-tool-bar></i></div></div>
    </div>
    <div class="crosshair"></div>
    <div class="notice"><strong data-message-title></strong><span data-message-body></span></div>
    <div class="controls">
      <button data-action>Use Tool</button>
      <button class="secondary" data-interact>Pretend</button>
      <button class="secondary" data-quit style="display:none">Quit</button>
    </div>
    <!-- Leaderboard Panel -->
    <div class="leaderboard-panel">
      <h3>Leaderboard</h3>
      <ul class="lb-list"><li>Sign in to see rankings</li></ul>
    </div>
  `;
  document.body.appendChild(hud);

  const arenaSelect = hud.querySelector('#arenaSelect');
  ARENAS.forEach((arena, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = arena.name;
    arenaSelect.appendChild(option);
  });

  arenaSelect.addEventListener('change', () => {
    state.arenaIndex = Number(arenaSelect.value);
    state.selectedProp = 0;
    state.started = false;
    fillPropSelect(hud);
    buildArena();
  });
  hud.querySelector('#roleSelect').addEventListener('change', event => {
    state.role = event.target.value;
    state.started = false;
    buildArena();
  });
  hud.querySelector('[data-start]').addEventListener('click', startRound);
  hud.querySelector('[data-reset]').addEventListener('click', () => {
    state.started = false;
    state.caught = false;
    state.disguised = false;
    if (playerPropMesh) { scene.remove(playerPropMesh); playerPropMesh = null; }
    buildArena();
    playerRoot.visible = true;
    // Show the panel again and re-attach avatar
    const panel = document.querySelector('section.panel');
    if (panel) panel.style.display = '';
    if (!Avatar.reattachAvatar(playerRoot)) {
      const authState = Auth.getAuthState();
      if (authState.isAuthenticated && authState.profile?.avatar3dUrl) {
        avatarMesh.userData.isAvatarPlaceholder = true;
        Avatar.loadAvatar(authState.profile.avatar3dUrl, playerRoot, { targetHeight: 1.7 });
      }
    }
  });
  hud.querySelector('[data-action]').addEventListener('click', useTool);
  hud.querySelector('[data-interact]').addEventListener('click', useInteract);
  hud.querySelector('[data-quit]').addEventListener('click', quitGame);
  // Multiplayer lobby buttons
  hud.querySelector('[data-create-room]').addEventListener('click', onCreateRoom);
  hud.querySelector('[data-refresh-rooms]').addEventListener('click', onRefreshRooms);
  hud.querySelector('[data-leave-room]').addEventListener('click', onLeaveRoom);
  hud.querySelector('[data-start-match]').addEventListener('click', onStartOnlineMatch);
  hud.querySelector('[data-lb-toggle]').addEventListener('click', onShowLeaderboard);
  hud.querySelector('[data-menu-toggle]').addEventListener('click', () => {
    const panel = document.querySelector('section.panel');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? '' : 'none';
    }
  });
  fillPropSelect(hud);
  return hud;
}

function fillPropSelect(hud) {
  const propSelect = hud.querySelector('#propSelect');
  propSelect.innerHTML = '';
  getArena().props.forEach((prop, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = prop.name;
    propSelect.appendChild(option);
  });
  propSelect.addEventListener('change', event => {
    state.selectedProp = Number(event.target.value);
  }, { once: true });
  propSelect.onchange = event => {
    state.selectedProp = Number(event.target.value);
  };
}

function updateUi() {
  ui.querySelector('[data-role]').textContent = state.role === 'hider' ? 'Hider' : 'Seeker';
  ui.querySelector('[data-phase]').textContent = state.started ? state.phase : 'Menu';
  ui.querySelector('[data-timer]').textContent = formatTime(Math.max(0, state.timer));
  ui.querySelector('[data-score]').textContent = String(Math.round(state.score));
  ui.querySelector('[data-message-title]').textContent = state.messageTitle;
  ui.querySelector('[data-message-body]').textContent = state.messageBody;
  ui.querySelector('[data-target]').textContent = `Target: ${currentTarget ? `${currentTarget.def.name}${currentTarget.fake ? ' ?' : ''}` : 'none'}`;

  const toolName = state.role === 'hider' ? 'Scan Shield' : 'Laser Eyes';
  const cooldown = state.role === 'hider' ? state.shieldCooldown : state.laserCooldown;
  const active = state.role === 'hider' ? state.shield : state.laser;
  const maxCooldown = state.role === 'hider' ? 18 : 12;
  ui.querySelector('[data-tool-name]').textContent = active > 0 ? `${toolName} active` : toolName;
  ui.querySelector('[data-tool-time]').textContent = active > 0 ? `${active.toFixed(1)}s` : cooldown > 0 ? `${Math.ceil(cooldown)}s` : 'Ready';
  ui.querySelector('[data-tool-bar]').style.transform = `scaleX(${cooldown > 0 ? 1 - cooldown / maxCooldown : 1})`;
  ui.querySelector('[data-interact]').textContent = state.disguised ? 'Stand Up' : 'Pretend';
}

function setMessage(title, body) {
  state.messageTitle = title;
  state.messageBody = body;
}

function showGameOverPopup(title, subtitle, won, score) {
  const existing = document.querySelector('.game-over-popup');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'game-over-popup';
  overlay.innerHTML = `
    <div class="game-over-card ${won ? 'win' : 'lose'}">
      <div class="game-over-icon">${won ? '🏆' : '💀'}</div>
      <h2 class="game-over-title">${title}</h2>
      <p class="game-over-subtitle">${subtitle}</p>
      <div class="game-over-score">Score: ${score}</div>
      <button class="game-over-btn">Next Round</button>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('.game-over-btn').addEventListener('click', () => {
    overlay.remove();
    startRound();
  });
}

function getArena() {
  return ARENAS[state.arenaIndex] || ARENAS[0];
}

function getSelectedProp() {
  return getArena().props[state.selectedProp] || getArena().props[0];
}

function getStartPosition(role) {
  const arena = getArena();
  if (arena.id === 'school') {
    return role === 'seeker' ? new THREE.Vector3(0, 0, 14) : new THREE.Vector3(0, 0, 3);
  }
  if (arena.id === 'arcade') {
    return role === 'seeker' ? new THREE.Vector3(0, 0, -18) : new THREE.Vector3(0, 0, 22);
  }
  if (arena.id === 'festival') {
    return role === 'seeker' ? new THREE.Vector3(0, 0, -21) : new THREE.Vector3(0, 0, 12);
  }
  return role === 'seeker' ? new THREE.Vector3(0, 0, -21) : new THREE.Vector3(0, 0, 22);
}

function formatTime(value) {
  const total = Math.ceil(value);
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return `${min}:${String(sec).padStart(2, '0')}`;
}

function getObjectCenter(object) {
  const box = new THREE.Box3().setFromObject(object);
  return box.getCenter(new THREE.Vector3());
}

function captureMaterialState(object) {
  const stateByUuid = new Map();
  object.traverse(child => {
    if (!child.isMesh || !child.material) return;
    stateByUuid.set(child.uuid, {
      color: child.material.color?.clone(),
      emissive: child.material.emissive?.clone(),
      emissiveIntensity: child.material.emissiveIntensity || 0
    });
  });
  return stateByUuid;
}

function restoreMaterialState(object, original) {
  object.traverse(child => {
    const saved = original?.get(child.uuid);
    if (!child.isMesh || !child.material || !saved) return;
    if (saved.color) child.material.color.copy(saved.color);
    if (saved.emissive) child.material.emissive.copy(saved.emissive);
    child.material.emissiveIntensity = saved.emissiveIntensity;
  });
}

function highlightEntry(entry, color, life) {
  pulseObject(entry.mesh, color, life);
  scanHighlights.push({ entry, life });
}

function pulseObject(object, color, life) {
  const c = new THREE.Color(color);
  object.traverse(child => {
    if (!child.isMesh || !child.material) return;
    child.material.color.lerp(c, 0.38);
    if (child.material.emissive) {
      child.material.emissive.copy(c);
      child.material.emissiveIntensity = 0.8;
    }
  });
  if (!scanHighlights.some(item => item.entry?.mesh === object)) {
    const entry = props.find(p => p.mesh === object);
    if (entry) scanHighlights.push({ entry, life });
  }
}

// ========== MULTIPLAYER SYNC ==========

function broadcastPosition(dt) {
  if (!state.online || !state.started) return;
  positionBroadcastTimer += dt;
  if (positionBroadcastTimer < 0.1) return; // 10 Hz
  positionBroadcastTimer = 0;

  MP.sendMessage({
    type: 'POSITION',
    x: playerRoot.position.x,
    z: playerRoot.position.z,
    ry: playerRoot.rotation.y,
    disguised: state.disguised,
    propId: state.disguised ? getSelectedProp().id : null,
    actorId: MP.getActorSessionId(),
  });
}

function updateRemotePlayers(dt) {
  if (!state.online) return;
  const now = performance.now();
  for (const [actorId, remote] of remotePlayers) {
    // Interpolate position
    if (remote.targetPos) {
      remote.mesh.position.lerp(remote.targetPos, Math.min(dt * 10, 1));
    }
    if (remote.targetRot !== undefined) {
      remote.mesh.rotation.y += (remote.targetRot - remote.mesh.rotation.y) * Math.min(dt * 10, 1);
    }
    // Remove stale (>5s no update)
    if (now - remote.lastUpdate > 5000) {
      scene.remove(remote.mesh);
      remotePlayers.delete(actorId);
    }
  }
}

function handleMultiplayerMessage(data) {
  if (!data || !data.type) return;
  const myId = MP.getActorSessionId();

  switch (data.type) {
    case 'POSITION': {
      if (data.actorId === myId) return;
      let remote = remotePlayers.get(data.actorId);
      if (!remote) {
        // Create remote player mesh
        const mesh = createRoleMarker('#e7c46a', data.actorId?.slice(-4) || '?');
        mesh.position.set(data.x || 0, 0, data.z || 0);
        scene.add(mesh);
        remote = { mesh, lastUpdate: performance.now(), targetPos: null, targetRot: 0 };
        remotePlayers.set(data.actorId, remote);
      }
      remote.targetPos = new THREE.Vector3(data.x, 0, data.z);
      remote.targetRot = data.ry || 0;
      remote.lastUpdate = performance.now();
      // Show as prop or player
      if (data.disguised && state.role === 'seeker') {
        // Remote hider in disguise — show as prop (for seeker to find)
        remote.mesh.visible = false; // Hidden when disguised
      } else {
        remote.mesh.visible = true;
      }
      break;
    }
    case 'PHASE_CHANGE': {
      if (!MP.getIsHost()) {
        state.phase = data.phase;
        state.timer = data.timer;
        if (data.phase === 'seek') {
          setMessage('Seek phase started', state.role === 'hider' ? 'Stay believable.' : 'Find the fake props!');
        }
      }
      break;
    }
    case 'ROLE_ASSIGN': {
      if (data.assignments && data.assignments[myId]) {
        state.role = data.assignments[myId];
        setMessage('Role assigned', `You are the ${state.role}!`);
        buildArena();
      }
      break;
    }
    case 'TAG_RESULT': {
      if (data.caught && data.targetActorId === myId) {
        state.caught = true;
        avatarMesh.visible = true;
        if (playerPropMesh) playerPropMesh.visible = false;
        setMessage('You were found!', 'The seeker tagged you.');
      }
      break;
    }
    case 'ROUND_END': {
      if (!MP.getIsHost()) {
        state.started = false;
        const won = (state.role === 'hider' && data.winner === 'hider') || (state.role === 'seeker' && data.winner === 'seeker');
        showGameOverPopup(
          data.winner === 'hider' ? 'Hiders Win!' : 'Seeker Wins!',
          won ? 'Your team won!' : 'Better luck next time.',
          won,
          Math.round(state.score)
        );
      }
      break;
    }
    case 'REQUEST_STATE': {
      if (MP.getIsHost()) {
        MP.sendMessage({
          type: 'FULL_STATE',
          phase: state.phase,
          timer: state.timer,
          arenaId: getArena().id,
          started: state.started,
        });
      }
      break;
    }
    case 'FULL_STATE': {
      if (!MP.getIsHost() && data.started) {
        state.phase = data.phase;
        state.timer = data.timer;
        state.started = data.started;
        const arenaIdx = ARENAS.findIndex(a => a.id === data.arenaId);
        if (arenaIdx >= 0 && arenaIdx !== state.arenaIndex) {
          state.arenaIndex = arenaIdx;
          buildArena();
        }
      }
      break;
    }
  }
}

// ========== ONLINE LOBBY UI ==========

function updateProfileChip() {
  const chip = document.querySelector('.profile-chip');
  if (!chip) return;
  const auth = Auth.getAuthState();
  if (auth.isAuthenticated && auth.profile) {
    const icon = auth.profile.avatarIconUrl
      ? `<img src="${auth.profile.avatarIconUrl}" class="profile-icon" />`
      : '<span class="profile-icon-placeholder">👤</span>';
    chip.innerHTML = `${icon}<span>${auth.profile.displayName}</span><button class="chip-btn" data-logout>Logout</button>`;
    chip.querySelector('[data-logout]')?.addEventListener('click', Auth.logout);
  } else if (auth.status === 'ready') {
    chip.innerHTML = '<span>Guest</span><button class="chip-btn" data-login>Sign In</button>';
    chip.querySelector('[data-login]')?.addEventListener('click', Auth.login);
  } else {
    chip.innerHTML = '<span>Connecting...</span>';
  }
}

async function onCreateRoom() {
  try {
    const auth = Auth.getAuthState();
    if (!auth.isAuthenticated) {
      setMessage('Sign in required', 'Please sign in to play online.');
      return;
    }
    if (!MP.getMpState().connected) {
      setMessage('Connecting...', 'Establishing multiplayer connection.');
      await MP.connectMatchmaking();
    }
    await MP.createRoom(`HideSeek_${Date.now().toString(36)}`, 10);
    state.online = true;
    state.matchId = MP.getMpState().roomId;
    await MP.initRealtimeSync();
    MP.bindMessageListeners();
    MP.onMessage(handleMultiplayerMessage);
    setMessage('Room created', `Waiting for players. Room: ${MP.getMpState().roomName}`);
    updateLobbyUi();
  } catch (err) {
    setMessage('Room creation failed', err?.message || 'Unknown error');
  }
}

async function onJoinRoom(roomId) {
  try {
    const auth = Auth.getAuthState();
    if (!auth.isAuthenticated) {
      setMessage('Sign in required', 'Please sign in to play online.');
      return;
    }
    if (!MP.getMpState().connected) {
      await MP.connectMatchmaking();
    }
    await MP.joinRoom(roomId);
    state.online = true;
    state.matchId = roomId;
    await MP.initRealtimeSync();
    MP.bindMessageListeners();
    MP.onMessage(handleMultiplayerMessage);
    // Request current state from host
    MP.sendMessage({ type: 'REQUEST_STATE' });
    setMessage('Joined room', MP.getMpState().roomName);
    updateLobbyUi();
  } catch (err) {
    setMessage('Join failed', err?.message || 'Unknown error');
  }
}

async function onLeaveRoom() {
  await MP.leaveRoom();
  state.online = false;
  state.matchId = null;
  // Remove remote player meshes
  for (const [, remote] of remotePlayers) {
    scene.remove(remote.mesh);
  }
  remotePlayers.clear();
  setMessage('Left room', 'Returned to local mode.');
  updateLobbyUi();
}

async function onStartOnlineMatch() {
  if (!MP.getIsHost()) return;
  const actors = MP.getMpState().actors;
  if (actors.length < 2) {
    setMessage('Need more players', 'At least 2 players required to start.');
    return;
  }
  // Assign roles: first actor is seeker, rest are hiders
  const assignments = {};
  actors.forEach((a, i) => {
    assignments[a.sessionId || a.actorId] = i === 0 ? 'seeker' : 'hider';
  });
  MP.sendMessage({ type: 'ROLE_ASSIGN', assignments });
  // Apply own role
  const myId = MP.getActorSessionId();
  state.role = assignments[myId] || 'hider';

  await MP.startGame();
  Leaderboard.resetSubmitGuard();
  startRound();

  // Broadcast phase
  MP.sendMessage({ type: 'PHASE_CHANGE', phase: state.phase, timer: state.timer });
}

async function onRefreshRooms() {
  const rooms = await MP.getAvailableRooms();
  const list = document.querySelector('.room-list');
  if (!list) return;
  if (rooms.length === 0) {
    list.innerHTML = '<li class="room-empty">No open rooms found</li>';
    return;
  }
  list.innerHTML = rooms.map(r => {
    const id = r.id || r.roomId || r.game_session || '';
    const name = r.name || 'Room';
    const count = r.playerCount ?? r.player_count ?? (Array.isArray(r.actors) ? r.actors.length : '?');
    return `<li><span>${name} (${count} players)</span><button class="chip-btn" data-join-id="${id}">Join</button></li>`;
  }).join('');
  list.querySelectorAll('[data-join-id]').forEach(btn => {
    btn.addEventListener('click', () => onJoinRoom(btn.dataset.joinId));
  });
}

function updateLobbyUi() {
  const panel = document.querySelector('.lobby-panel');
  if (!panel) return;
  const mpState = MP.getMpState();
  if (mpState.inRoom) {
    panel.querySelector('.lobby-pre-room').style.display = 'none';
    panel.querySelector('.lobby-in-room').style.display = '';
    panel.querySelector('[data-room-name]').textContent = mpState.roomName || mpState.roomId;
    panel.querySelector('[data-room-players]').textContent = `${mpState.actors.length} player(s)`;
    panel.querySelector('[data-start-match]').style.display = mpState.isHost ? '' : 'none';
  } else {
    panel.querySelector('.lobby-pre-room').style.display = '';
    panel.querySelector('.lobby-in-room').style.display = 'none';
  }
}

async function onShowLeaderboard() {
  const panel = document.querySelector('.leaderboard-panel');
  if (!panel) return;
  panel.classList.toggle('visible');
  if (!panel.classList.contains('visible')) return;
  const rankings = await Leaderboard.fetchLeaderboard(10);
  const list = panel.querySelector('.lb-list');
  if (rankings.length === 0) {
    list.innerHTML = '<li>No scores yet</li>';
  } else {
    list.innerHTML = rankings.map(e =>
      `<li><span class="lb-rank">#${e.rank}</span><span class="lb-name">${e.name}</span><span class="lb-score">${e.score}</span></li>`
    ).join('');
  }
}
