import React from 'react';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';

type IconName =
  | 'binder' | 'camera' | 'heart' | 'star' | 'sparkle' | 'plus' | 'home'
  | 'search' | 'menu' | 'close' | 'check' | 'chevron-left' | 'chevron-right'
  | 'edit' | 'filter' | 'text' | 'sticker' | 'flip' | 'lock' | 'timer'
  | 'flash' | 'note' | 'gear' | 'bell' | 'photo' | 'magic' | 'sound'
  | 'template' | 'shutter';

interface PocaIconProps {
  name: IconName;
  size?: number;
  color?: string;
  filled?: boolean;
  strokeWidth?: number;
}

export function PocaIcon({ name, size = 24, color = '#3B2A1A', filled = false, strokeWidth = 1.8 }: PocaIconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: filled ? color : 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'binder':
      return (
        <Svg {...props}>
          <Path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          <Path d="M3 11h18" />
          <Circle cx="7" cy="9" r="0.5" fill={color} stroke="none" />
        </Svg>
      );
    case 'camera':
      return (
        <Svg {...props}>
          <Path d="M3 7h3.5l1.5-2h8l1.5 2H21v12H3z" />
          <Circle cx="12" cy="13" r="4" />
        </Svg>
      );
    case 'heart':
      return (
        <Svg {...props}>
          <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l9.84 9.84 9.84-9.84a5.5 5.5 0 000-7.78z" />
        </Svg>
      );
    case 'star':
      return (
        <Svg {...props}>
          <Polygon points="12,2.5 14.8,9 22,9.6 16.5,14.4 18.2,21.5 12,17.7 5.8,21.5 7.5,14.4 2,9.6 9.2,9" />
        </Svg>
      );
    case 'sparkle':
      return (
        <Svg {...props}>
          <Path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z" />
        </Svg>
      );
    case 'plus':
      return (
        <Svg {...props}>
          <Path d="M12 5v14M5 12h14" />
        </Svg>
      );
    case 'home':
      return (
        <Svg {...props}>
          <Path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2v-9z" />
        </Svg>
      );
    case 'search':
      return (
        <Svg {...props}>
          <Circle cx="11" cy="11" r="7" />
          <Path d="M21 21l-4.5-4.5" />
        </Svg>
      );
    case 'menu':
      return (
        <Svg {...props} fill={color} stroke="none">
          <Circle cx="5" cy="12" r="1.2" />
          <Circle cx="12" cy="12" r="1.2" />
          <Circle cx="19" cy="12" r="1.2" />
        </Svg>
      );
    case 'close':
      return (
        <Svg {...props}>
          <Path d="M6 6l12 12M18 6L6 18" />
        </Svg>
      );
    case 'check':
      return (
        <Svg {...props}>
          <Path d="M5 12l5 5 9-11" />
        </Svg>
      );
    case 'chevron-left':
      return (
        <Svg {...props}>
          <Path d="M15 6l-6 6 6 6" />
        </Svg>
      );
    case 'chevron-right':
      return (
        <Svg {...props}>
          <Path d="M9 6l6 6-6 6" />
        </Svg>
      );
    case 'edit':
      return (
        <Svg {...props}>
          <Path d="M14 4l6 6-11 11H3v-6z" />
          <Path d="M13 5l6 6" />
        </Svg>
      );
    case 'filter':
      return (
        <Svg {...props}>
          <Circle cx="12" cy="12" r="9" />
          <Circle cx="12" cy="12" r="3" />
        </Svg>
      );
    case 'text':
      return (
        <Svg {...props}>
          <Path d="M5 6h14M12 6v14M9 20h6" />
        </Svg>
      );
    case 'sticker':
      return (
        <Svg {...props}>
          <Path d="M4 4h11l5 5v11H4z" />
          <Path d="M15 4v5h5" />
        </Svg>
      );
    case 'flip':
      return (
        <Svg {...props}>
          <Path d="M4 8a8 8 0 0114-3M20 16a8 8 0 01-14 3" />
          <Path d="M4 4v4h4M20 20v-4h-4" />
        </Svg>
      );
    case 'lock':
      return (
        <Svg {...props}>
          <Rect x="5" y="11" width="14" height="9" rx="2" />
          <Path d="M8 11V8a4 4 0 018 0v3" />
        </Svg>
      );
    case 'timer':
      return (
        <Svg {...props}>
          <Circle cx="12" cy="13" r="8" />
          <Path d="M12 9v4l3 2M9 3h6" />
        </Svg>
      );
    case 'flash':
      return (
        <Svg {...props}>
          <Path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
        </Svg>
      );
    case 'note':
      return (
        <Svg {...props}>
          <Path d="M5 4h11l3 3v13H5z" />
          <Path d="M9 10h6M9 14h6M9 18h4" />
        </Svg>
      );
    case 'bell':
      return (
        <Svg {...props}>
          <Path d="M6 16V11a6 6 0 0112 0v5l2 2H4z" />
          <Path d="M10 21h4" />
        </Svg>
      );
    case 'photo':
      return (
        <Svg {...props}>
          <Rect x="3" y="5" width="18" height="14" rx="2" />
          <Circle cx="9" cy="11" r="2" />
          <Path d="M21 17l-5-5-9 7" />
        </Svg>
      );
    case 'magic':
      return (
        <Svg {...props}>
          <Path d="M5 19l9-9M14 5l1 3 3 1-3 1-1 3-1-3-3-1 3-1zM4 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
        </Svg>
      );
    case 'template':
      return (
        <Svg {...props}>
          <Rect x="3" y="3" width="8" height="8" rx="1.5" />
          <Rect x="13" y="3" width="8" height="8" rx="1.5" />
          <Rect x="3" y="13" width="8" height="8" rx="1.5" />
          <Rect x="13" y="13" width="8" height="8" rx="1.5" />
        </Svg>
      );
    case 'shutter':
      return (
        <Svg {...props}>
          <Circle cx="12" cy="12" r="10" />
          <Circle cx="12" cy="12" r="7" />
        </Svg>
      );
    default:
      return null;
  }
}
