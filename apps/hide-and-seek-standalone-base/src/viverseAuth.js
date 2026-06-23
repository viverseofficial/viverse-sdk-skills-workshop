// viverseAuth.js — Standalone workshop stub

let listeners = [];
let authState = {
  status: 'ready',
  isAuthenticated: false,
  accessToken: null,
  accountId: null,
  profile: null,
};

export function getAuthState() {
  return authState;
}

export function onAuthChange(cb) {
  listeners.push(cb);
  return () => { listeners = listeners.filter(listener => listener !== cb); };
}

export async function initialize() {
  return authState;
}

export function login() {
  console.info('[StandaloneBase] Login is disabled in the standalone baseline.');
}

export function logout() {
  authState = {
    status: 'ready',
    isAuthenticated: false,
    accessToken: null,
    accountId: null,
    profile: null,
  };
  for (const cb of listeners) {
    try { cb(authState); } catch (_) {}
  }
}

export function getSdk() {
  return null;
}

export function getClient() {
  return null;
}
