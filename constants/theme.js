import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const COLORS = {
  primary: '#009D7C', // Green
  secondary: '#E7B15A', // Red

  primary2: '#E7B15A', // Orange
  primary3: '#33354E', // Dark Blue
  gray10: '#E5E5E5',
  gray20: '#CCCCCC',
  gray30: '#A1A1A1',
  gray40: '#999999',
  gray50: '#7F7F7F',
  gray60: '#666666',
  gray70: '#4C4C4C',
  gray80: '#333333',
  gray85: '#242526',
  gray90: '#191919',
  success: '#28a745',
  danger: '#990000',
  yellow: '#ffe300',
  orange: '#FFA500',
  blue: '#4562d7',
  blue10: '#26a1f4',
  green: '#1b8e2d',
  drawerActiveColor: '#c5cdf6',

  additionalColor4: '#C3C3C3',
  additionalColor9: '#F3F3F3',
  additionalColor11: '#F0FFFB',
  additionalColor13: '#EBF3EF',

  white: '#FFFFFF',
  black: '#000000',
  red: '#990000',
  red1: '#d32f2f',

  transparent: 'transparent',
  transparentWhite1: 'rgba(255, 255, 255, 0.1)',
  transparentBlack1: 'rgba(0, 0, 0, 0.1)',
  transparentBlack7: 'rgba(0, 0, 0, 0.7)',
};
export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  h5: 12,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimensions
  width,
  height,
};
export const FONTS = {
  largeTitle: {fontSize: SIZES.largeTitle},
  h1: {fontSize: SIZES.h1, lineHeight: 36},
  h2: {fontSize: SIZES.h2, lineHeight: 30},
  h3: {fontSize: SIZES.h3, lineHeight: 22},
  h4: {fontSize: SIZES.h4, lineHeight: 22},
  h5: {fontSize: SIZES.h5, lineHeight: 22},
  body1: {fontSize: SIZES.body1, lineHeight: 36},
  body2: {fontSize: SIZES.body2, lineHeight: 30},
  body3: {fontSize: SIZES.body3, lineHeight: 22},
  body4: {fontSize: SIZES.body4, lineHeight: 22},
  body5: {fontSize: SIZES.body5, lineHeight: 22},
};

export const darkTheme = {
  name: 'dark',
  backgroundColor1: COLORS.gray85,
  backgroundColor2: COLORS.gray90,
  backgroundColor3: COLORS.gray90,
  backgroundColor4: COLORS.primary,
  backgroundColor5: COLORS.gray85,
  backgroundColor6: COLORS.black,
  backgroundColor7: COLORS.gray90,
  backgroundColor8: COLORS.gray70,
  lineDivider: COLORS.gray70,
  borderColor1: COLORS.gray70,
  borderColor2: COLORS.gray70,
  textColor: COLORS.white,
  textColor2: COLORS.white,
  textColor3: COLORS.gray40,
  textColor4: COLORS.white,
  textColor5: COLORS.gray30,
  textColor6: COLORS.gray30,
  textColor7: COLORS.gray40,
  tintColor: COLORS.white,
  dotColor1: COLORS.white,
  dotColor2: COLORS.primary,
};

export const lightTheme = {
  name: 'light',
  backgroundColor1: COLORS.white,
  backgroundColor2: COLORS.primary3,
  backgroundColor3: COLORS.additionalColor11,
  backgroundColor4: COLORS.white,
  backgroundColor5: COLORS.additionalColor13,
  backgroundColor6: COLORS.primary3,
  backgroundColor7: COLORS.white,
  backgroundColor8: COLORS.gray10,
  lineDivider: COLORS.gray20,
  borderColor1: COLORS.white,
  borderColor2: COLORS.black,
  textColor: COLORS.black,
  textColor2: COLORS.primary,
  textColor3: COLORS.gray80,
  textColor4: COLORS.white,
  textColor5: COLORS.black,
  textColor6: COLORS.gray,
  textColor7: COLORS.black,
  tintColor: COLORS.black,
  dotColor1: COLORS.gray20,
  dotColor2: COLORS.primary3,
};

export const selectedTheme = darkTheme;

const appTheme = {COLORS, SIZES, FONTS, darkTheme, lightTheme};

export default appTheme;
