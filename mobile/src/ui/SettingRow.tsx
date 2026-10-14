import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { SettingRowProps } from './SettingRow.types';
import { type, useTheme } from './theme';

/** Android and fallback: a quiet row that opens a plain list of options. */
export function SettingRow({ label, options, value, onChange }: SettingRowProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value)?.label ?? value;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${current}`}
        onPress={() => setOpen(true)}
        android_ripple={{ color: theme.hairline }}
        style={[styles.row, { borderBottomColor: theme.hairline }]}>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        <Text style={[styles.value, { color: theme.secondary }]} numberOfLines={1}>
          {current}  ›
        </Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.scrim} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: theme.background }]}>
            <FlatList
              data={options}
              keyExtractor={(o) => o.value}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: item.value === value }}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  style={[styles.option, { borderBottomColor: theme.hairline }]}>
                  <Text
                    style={[
                      styles.optionText,
                      { color: item.value === value ? theme.accent : theme.text },
                    ]}>
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: { fontSize: type.row },
  value: { fontSize: type.row, flexShrink: 1, marginLeft: 16 },
  scrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 32 },
  sheet: { borderRadius: 16, maxHeight: '70%', overflow: 'hidden' },
  option: { paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: StyleSheet.hairlineWidth },
  optionText: { fontSize: type.row },
});
