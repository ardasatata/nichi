import { Pressable, StyleSheet, Text, View } from 'react-native';

import { renderDay } from '../format/render';
import { MAX_PROFILES, type Profile, type ProfileID } from '../model/profile';
import { glyphFont, useTheme } from './theme';

type Props = {
  profiles: Profile[];
  selected: ProfileID;
  onSelect: (id: ProfileID) => void;
  onAdd: () => void;
};

/** One chip per profile, each showing its own glyph. A lone profile shows only the add button. */
export function ProfileChips({ profiles, selected, onSelect, onAdd }: Props) {
  const theme = useTheme();
  const now = new Date();
  return (
    <View style={styles.row}>
      {profiles.length > 1 &&
        profiles.map((p) => {
          const active = p.id === selected;
          const glyph = renderDay(p, now).main;
          return (
            <Pressable
              key={p.id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Profile ${p.id}`}
              onPress={() => onSelect(p.id)}
              style={[styles.chip, { backgroundColor: active ? theme.chipSelected : theme.chip }]}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.glyph, { color: active ? '#FFFFFF' : theme.text, fontFamily: glyphFont }]}>
                {glyph}
              </Text>
            </Pressable>
          );
        })}
      {profiles.length < MAX_PROFILES && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add profile"
          onPress={onAdd}
          style={[styles.chip, { backgroundColor: theme.chip }]}>
          <Text style={[styles.plus, { color: theme.secondary }]}>+</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 10, minHeight: 44 },
  chip: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  glyph: { fontSize: 20 },
  plus: { fontSize: 24, lineHeight: 26 },
});
