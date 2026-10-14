import { StyleSheet, Text, View } from 'react-native';

import type { DayText } from '../format/render';
import { glyphFont, type, useTheme } from './theme';

/** The selected profile exactly as the widget shows it today. */
export function Preview({ day, long }: { day: DayText; long: string }) {
  const theme = useTheme();
  return (
    <View style={styles.wrap} accessible accessibilityLabel={long}>
      {/* Long strings (full dates) shrink to fit instead of wrapping the hero size. */}
      <Text
        style={[styles.main, { color: theme.accent, fontFamily: glyphFont, fontSize: type.hero }]}
        numberOfLines={2}
        adjustsFontSizeToFit>
        {day.main}
      </Text>
      <Text style={[styles.sub, { color: theme.secondary }]} numberOfLines={1}>
        {day.sub || ' '}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: 24 },
  main: { textAlign: 'center', includeFontPadding: false },
  sub: { fontSize: type.caption + 2, marginTop: 4 },
});
