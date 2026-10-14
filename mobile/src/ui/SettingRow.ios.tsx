import { Host, Picker, Text as SwiftText } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import { StyleSheet, Text, View } from 'react-native';

import type { SettingRowProps } from './SettingRow.types';
import { type, useTheme } from './theme';

/** iOS: the value is a native SwiftUI menu picker, like a system settings row. */
export function SettingRow({ label, options, value, onChange }: SettingRowProps) {
  const theme = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: theme.hairline }]}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <Host matchContents>
        <Picker selection={value} onSelectionChange={onChange} modifiers={[pickerStyle('menu')]}>
          {options.map((o) => (
            <SwiftText key={o.value} modifiers={[tag(o.value)]}>
              {o.label}
            </SwiftText>
          ))}
        </Picker>
      </Host>
    </View>
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
});
