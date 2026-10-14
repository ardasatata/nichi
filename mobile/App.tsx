import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AppState, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { renderDay, validatePattern } from './src/format/render';
import {
  CALENDARS,
  DISPLAY_STYLES,
  LOCALES,
  type CalendarID,
  type DisplayStyle,
  type ProfileID,
} from './src/model/profile';
import { profileStore, useProfiles } from './src/store/profiles';
import { Preview } from './src/ui/Preview';
import { ProfileChips } from './src/ui/ProfileChips';
import { SettingRow } from './src/ui/SettingRow';
import { type, useTheme } from './src/ui/theme';
import { publishProfiles } from './src/widgets/publish';

function Screen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const profiles = useProfiles();
  const [selectedID, setSelectedID] = useState<ProfileID>(profiles[0].id);
  const selected = profiles.find((p) => p.id === selectedID) ?? profiles[0];

  // Keep widgets in sync: on every change and whenever the app returns to the foreground.
  useEffect(() => {
    publishProfiles(profiles);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') publishProfiles(profileStore.get());
    });
    return () => sub.remove();
  }, [profiles]);

  const now = new Date();
  const day = renderDay(selected, now);
  const longDate = renderDay({ ...selected, style: 'fullDate' }, now).main;
  const patternError = selected.style === 'custom' ? validatePattern(selected.customPattern) : null;

  const set = (patch: Parameters<typeof profileStore.update>[1]) =>
    profileStore.update(selected.id, patch);

  const hint =
    profiles.length > 1
      ? 'Long-press a widget and choose Edit Widget to pick a profile.'
      : 'Add the widget from your home or lock screen.';
  const androidHint = 'Add “Nichi 1” from your widgets. More profiles appear as Nichi 2–4.';

  return (
    <View style={[styles.screen, { backgroundColor: theme.background, paddingTop: insets.top + 16 }]}>
      <StatusBar style="auto" />
      <ProfileChips
        profiles={profiles}
        selected={selected.id}
        onSelect={setSelectedID}
        onAdd={() => {
          const id = profileStore.add();
          if (id) setSelectedID(id);
        }}
      />

      <View style={styles.preview}>
        <Preview day={day} long={longDate} />
      </View>

      <View style={[styles.rows, { borderTopColor: theme.hairline, borderTopWidth: StyleSheet.hairlineWidth }]}>
        <SettingRow
          label="Language"
          options={LOCALES}
          value={selected.localeID}
          onChange={(localeID) => set({ localeID })}
        />
        <SettingRow
          label="Calendar"
          options={CALENDARS}
          value={selected.calendarID}
          onChange={(calendarID) => set({ calendarID: calendarID as CalendarID })}
        />
        <SettingRow
          label="Show"
          options={DISPLAY_STYLES}
          value={selected.style}
          onChange={(style) => set({ style: style as DisplayStyle })}
        />
        {selected.style === 'custom' && (
          <View style={[styles.pattern, { borderBottomColor: theme.hairline }]}>
            <TextInput
              value={selected.customPattern}
              onChangeText={(customPattern) => set({ customPattern })}
              placeholder="M/d(EEEEE)"
              placeholderTextColor={theme.secondary}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Date pattern"
              style={[styles.input, { color: theme.text }]}
            />
            {patternError && (
              <Text style={[styles.error, { color: theme.accent }]}>{patternError}</Text>
            )}
          </View>
        )}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {profiles.length > 1 && selected.id !== '1' && (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              profileStore.remove(selected.id);
              setSelectedID('1');
            }}>
            <Text style={[styles.remove, { color: theme.secondary }]}>Remove profile</Text>
          </Pressable>
        )}
        <Text style={[styles.hint, { color: theme.secondary }]}>
          {Platform.OS === 'android' ? androidHint : hint}
        </Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Screen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  preview: { flex: 1, justifyContent: 'center', minHeight: 200 },
  rows: {},
  pattern: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  input: { fontSize: type.row, minHeight: 36, fontFamily: undefined },
  error: { fontSize: type.caption, marginTop: 2 },
  footer: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, gap: 12 },
  remove: { fontSize: type.row },
  hint: { fontSize: type.caption, textAlign: 'center' },
});
