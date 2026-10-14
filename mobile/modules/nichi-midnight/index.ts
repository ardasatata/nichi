import { requireNativeModule } from 'expo';

type NichiMidnightModule = {
  /** Schedules an inexact alarm at the next local midnight that refreshes the widgets. */
  schedule(): void;
};

const native = requireNativeModule<NichiMidnightModule>('NichiMidnight');

export function schedule(): void {
  native.schedule();
}
