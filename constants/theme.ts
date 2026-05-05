import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#3B2A1A',
    background: '#FAF1E1',
    tint: '#E8537A',
    icon: '#6B4F36',
    tabIconDefault: '#9C7E5F',
    tabIconSelected: '#E8537A',
  },
  dark: {
    text: '#FAF1E1',
    background: '#2A1A0F',
    tint: '#E8537A',
    icon: '#C9B8A8',
    tabIconDefault: '#9C7E5F',
    tabIconSelected: '#E8537A',
  },
};

export const Kuaci = {
  // Paper palette
  paper1: '#FAF1E1',
  paper2: '#F4E7D0',
  paper3: '#ECDDC3',

  // Ink
  ink1: '#3B2A1A',
  ink2: '#6B4F36',
  ink3: '#9C7E5F',

  // Dusty pastels
  rose: '#E8A8B5',
  blush: '#F2C8CD',
  sage: '#B8C9A8',
  mint: '#C9DDC8',
  butter: '#F0D89C',
  peach: '#E8B89A',
  sky: '#B8C9D8',
  lilac: '#C9B8D8',

  // Pops
  pink: '#E8537A',
  coral: '#E8A05F',
  leafGreen: '#6FB89A',

  // Tape
  tapeAmber: 'rgba(232,160,95,0.65)',
  tapeRose: 'rgba(232,168,181,0.65)',
  tapeSage: 'rgba(184,201,168,0.60)',

  // Radii
  sm: 6,
  md: 12,
  lg: 18,
  xl: 22,
  pill: 999,

  // Shadows (iOS)
  shadow: {
    color: '#6B4F36',
    offset: { width: 0, height: 2 },
    opacity: 0.1,
    radius: 8,
    elevation: 3,
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    display: 'Fredoka_600SemiBold',
    displayMed: 'Fredoka_500Medium',
    body: 'Quicksand_500Medium',
    bodySemi: 'Quicksand_600SemiBold',
    bodyBold: 'Quicksand_700Bold',
    script: 'Caveat_400Regular',
    typewriter: 'SpecialElite_400Regular',
  },
  default: {
    display: 'Fredoka_600SemiBold',
    displayMed: 'Fredoka_500Medium',
    body: 'Quicksand_500Medium',
    bodySemi: 'Quicksand_600SemiBold',
    bodyBold: 'Quicksand_700Bold',
    script: 'Caveat_400Regular',
    typewriter: 'SpecialElite_400Regular',
  },
});
