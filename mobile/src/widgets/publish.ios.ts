import { buildTimeline } from '../format/dayTable';
import { localeLabel, type Profile } from '../model/profile';
import { NichiDay } from './NichiDay.ios';

export function publishProfiles(profiles: Profile[]): void {
  // One entry per local midnight for a year: WidgetKit flips the day without the app.
  NichiDay.updateTimeline(buildTimeline(profiles));
  // Edit Widget lists the current profiles.
  NichiDay.setConfigurationParameterEnum(
    'profile',
    profiles.map((p) => ({ name: `${p.id} · ${localeLabel(p.localeID)}`, value: p.id }))
  );
}
