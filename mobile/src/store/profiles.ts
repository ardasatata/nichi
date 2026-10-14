import Storage from 'expo-sqlite/kv-store';
import { useSyncExternalStore } from 'react';

import {
  MAX_PROFILES,
  defaultProfile,
  nextProfileID,
  type Profile,
  type ProfileID,
} from '../model/profile';

const KEY = 'profiles.v1';

function load(): Profile[] {
  try {
    const raw = Storage.getItemSync(KEY);
    const parsed = raw ? (JSON.parse(raw) as Profile[]) : null;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, MAX_PROFILES);
  } catch {
    // Fall through to the default profile.
  }
  return [defaultProfile('1')];
}

let current: Profile[] = load();
const listeners = new Set<() => void>();

function set(next: Profile[]) {
  current = next;
  try {
    Storage.setItemSync(KEY, JSON.stringify(next));
  } catch {
    // Persistence is best effort; the in-memory state still updates.
  }
  listeners.forEach((l) => l());
}

export const profileStore = {
  get: () => current,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  update(id: ProfileID, patch: Partial<Omit<Profile, 'id'>>) {
    set(current.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  },
  add(): ProfileID | null {
    const id = nextProfileID(current);
    if (!id) return null;
    set([...current, defaultProfile(id, 'zh-Hans')]);
    return id;
  },
  remove(id: ProfileID) {
    if (current.length < 2) return;
    set(current.filter((p) => p.id !== id));
  },
};

export function useProfiles(): Profile[] {
  return useSyncExternalStore(profileStore.subscribe, profileStore.get);
}
