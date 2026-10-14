import {
  AccessoryWidgetBackground,
  Text,
  VStack,
  ZStack,
} from '@expo/ui/swift-ui';
import {
  containerBackground,
  font,
  foregroundStyle,
  lineLimit,
  minimumScaleFactor,
  multilineTextAlignment,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import type { TimelineProps } from '../format/dayTable';

type Configuration = { profile?: string };

// Widget bodies run in an isolated runtime: keep every constant inside the function.
const NichiDayWidget = (props: TimelineProps, environment: WidgetEnvironment<Configuration>) => {
  'widget';

  const accent = '#E0412F';
  const dark = environment.colorScheme === 'dark';
  const background = dark ? '#161413' : '#FBF9F6';
  const secondary = dark ? '#A39B93' : '#6B6560';

  // Enum cases must be Swift identifiers, so profiles are configured as "p1".."p4".
  const profile = (environment.configuration?.profile ?? 'p1').slice(1);
  const entry = props.p?.[profile as '1'] ?? props.p?.['1'] ?? { main: '日', sub: 'Open Nichi' };
  const family = environment.widgetFamily;

  if (family === 'accessoryInline') {
    return (
      <Text modifiers={[widgetURL('nichi://')]}>
        {entry.sub ? `${entry.main} · ${entry.sub}` : entry.main}
      </Text>
    );
  }

  if (family === 'accessoryCircular') {
    return (
      <ZStack modifiers={[widgetURL('nichi://')]}>
        <AccessoryWidgetBackground />
        <Text
          modifiers={[
            font({ size: 30, weight: 'semibold', design: 'serif' }),
            minimumScaleFactor(0.4),
            lineLimit(1),
          ]}>
          {entry.main}
        </Text>
      </ZStack>
    );
  }

  if (family === 'accessoryRectangular') {
    return (
      <VStack alignment="leading" spacing={2} modifiers={[widgetURL('nichi://')]}>
        <Text
          modifiers={[
            font({ size: 26, weight: 'semibold', design: 'serif' }),
            minimumScaleFactor(0.5),
            lineLimit(1),
          ]}>
          {entry.main}
        </Text>
        {entry.sub ? <Text modifiers={[font({ size: 13 }), lineLimit(1)]}>{entry.sub}</Text> : null}
      </VStack>
    );
  }

  return (
    <VStack
      spacing={6}
      modifiers={[widgetURL('nichi://'), containerBackground(background, 'widget')]}>
      <Text
        modifiers={[
          font({ size: 84, weight: 'medium', design: 'serif' }),
          foregroundStyle(accent),
          minimumScaleFactor(0.25),
          lineLimit(2),
          multilineTextAlignment('center'),
        ]}>
        {entry.main}
      </Text>
      {entry.sub ? (
        <Text
          modifiers={[
            font({ size: 14, weight: 'regular' }),
            foregroundStyle(secondary),
            minimumScaleFactor(0.6),
            lineLimit(1),
          ]}>
          {entry.sub}
        </Text>
      ) : null}
    </VStack>
  );
};

export const NichiDay = createWidget<TimelineProps, Configuration>('NichiDay', NichiDayWidget, {
  p: {},
});
