import type { Profile } from '../model/profile';

/**
 * Pushes the current profiles to the home/lock screen widgets.
 * The platform files (`publish.ios.ts`, `publish.android.ts`) do the real work;
 * this fallback keeps other targets (tests, web) working.
 */
export function publishProfiles(_profiles: Profile[]): void {}
