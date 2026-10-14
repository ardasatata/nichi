import { Platform, useColorScheme } from 'react-native';

export type Theme = {
  background: string;
  text: string;
  secondary: string;
  hairline: string;
  accent: string;
  chip: string;
  chipSelected: string;
};

const light: Theme = {
  background: '#FBF9F6',
  text: '#1D1B1A',
  secondary: '#6B6560',
  hairline: '#E6E0D9',
  accent: '#C8281E',
  chip: '#F0EBE4',
  chipSelected: '#C8281E',
};

const dark: Theme = {
  background: '#161413',
  text: '#F1ECE6',
  secondary: '#A39B93',
  hairline: '#2D2926',
  accent: '#F0544A',
  chip: '#25211F',
  chipSelected: '#F0544A',
};

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}

/** Serif that carries CJK well; matches the 日 app icon. */
export const glyphFont = Platform.select({
  ios: 'Hiragino Mincho ProN',
  default: 'serif',
});

/** Fixed type scale: hero / row / caption. */
export const type = { hero: 120, row: 17, caption: 13 } as const;
