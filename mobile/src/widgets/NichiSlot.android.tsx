import { Box, Column, Text } from '@expo/ui/jetpack-compose';
import { fillMaxSize, paddingAll } from '@expo/ui/jetpack-compose/modifiers';
import { createWidget } from 'expo-widgets';

export type SlotProps = {
  /** False for slots whose profile was removed: the widget shows a setup hint. */
  configured: boolean;
  /** Pre-rendered text per local day, keyed `YYYY-MM-DD`. */
  days: Record<string, { main: string; sub: string }>;
};

// Widget bodies run in an isolated runtime: keep every constant inside the function.
const NichiSlotWidget = (props: SlotProps) => {
  'widget';

  const accent = '#E0412F';

  if (!props.configured) {
    return (
      <Box modifiers={[fillMaxSize(), paddingAll(8)]} contentAlignment="center">
        <Text fontSize={13}>Set up in Nichi</Text>
      </Box>
    );
  }

  const now = new Date();
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  const key = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  const days = props.days ?? {};
  const keys = Object.keys(days);
  const entry = days[key] ?? (keys.length > 0 ? days[keys[keys.length - 1]] : null);

  if (!entry) {
    return (
      <Box modifiers={[fillMaxSize(), paddingAll(8)]} contentAlignment="center">
        <Text fontSize={13}>Open Nichi</Text>
      </Box>
    );
  }

  return (
    <Box modifiers={[fillMaxSize(), paddingAll(8)]} contentAlignment="center">
      <Column horizontalAlignment="center" verticalArrangement="center">
        <Text fontSize={64} fontWeight="500" fontFamily="serif" color={accent} textAlign="center">
          {entry.main}
        </Text>
        {entry.sub ? (
          <Text fontSize={13} textAlign="center">
            {entry.sub}
          </Text>
        ) : null}
      </Column>
    </Box>
  );
};

const initial: SlotProps = { configured: false, days: {} };

export const slots = [
  createWidget<SlotProps>('NichiSlot1', NichiSlotWidget, initial),
  createWidget<SlotProps>('NichiSlot2', NichiSlotWidget, initial),
  createWidget<SlotProps>('NichiSlot3', NichiSlotWidget, initial),
  createWidget<SlotProps>('NichiSlot4', NichiSlotWidget, initial),
];
