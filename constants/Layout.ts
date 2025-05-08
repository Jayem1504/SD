import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// 8px grid system
export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  full: 9999,
};

// Typography
export const typography = {
  fontSizes: {
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeights: {
    body: 1.5, // 150%
    heading: 1.2, // 120%
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
};

// Shadows
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
};

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  spacing,
  borderRadius,
  typography,
  shadows,
};