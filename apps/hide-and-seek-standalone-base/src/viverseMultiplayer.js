// viverseMultiplayer.js — Standalone workshop stub

const mpState = {
  connected: false,
  inRoom: false,
  roomId: '',
  roomName: '',
  actors: [],
  isHost: false,
  gameStarted: false,
};

let messageHandlers = [];

function unsupported() {
  throw new Error('Multiplayer is disabled in the standalone baseline.');
}

export function getMpState() { return mpState; }

export function onMpChange() {
  return () => {};
}

export async function connectMatchmaking() {
  unsupported();
}

export async function getAvailableRooms() {
  return [];
}

export async function createRoom() {
  unsupported();
}

export async function joinRoom() {
  unsupported();
}

export async function leaveRoom() {
  mpState.connected = false;
  mpState.inRoom = false;
  mpState.roomId = '';
  mpState.roomName = '';
  mpState.actors = [];
  mpState.isHost = false;
  mpState.gameStarted = false;
}

export async function startGame() {
  unsupported();
}

export async function initRealtimeSync() {
  unsupported();
}

export function sendMessage() {}

export function onMessage(cb) {
  messageHandlers.push(cb);
  return () => { messageHandlers = messageHandlers.filter(handler => handler !== cb); };
}

export function bindMessageListeners() {}

export async function setRoomProperties() {}

export function disconnect() {
  messageHandlers = [];
}

export function getActorSessionId() { return ''; }
export function getIsHost() { return false; }
export function getMultiplayerClient() { return null; }
