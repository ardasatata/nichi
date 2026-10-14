import { schedule } from '../../modules/nichi-midnight';
import { buildYearTable } from '../format/dayTable';
import { PROFILE_IDS, type Profile } from '../model/profile';
import { slots } from './NichiSlot.android';

export function publishProfiles(profiles: Profile[]): void {
  const from = new Date();
  PROFILE_IDS.forEach((id, index) => {
    const profile = profiles.find((p) => p.id === id);
    slots[index].updateSnapshot(
      profile
        ? { configured: true, days: buildYearTable(profile, from) }
        : { configured: false, days: {} }
    );
  });
  // Android widgets never refresh themselves: wake them at the next local midnight.
  schedule();
}
