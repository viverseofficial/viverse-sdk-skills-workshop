// viverseAvatar.js — Standalone workshop stub

export function loadAvatar(avatarUrl, targetGroup, opts = {}) {
  opts.onError?.('Avatar loading is disabled in the standalone baseline.');
}

export function updateAnimation() {}

export function removeAvatar() {}

export function getCachedModel() {
  return null;
}

export function reattachAvatar() {
  return false;
}

export function hasBoneAnimation() {
  return false;
}
