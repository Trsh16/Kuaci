import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, Circle, Rect, Line, G } from 'react-native-svg';

interface StickerProps {
  size?: number;
  style?: object;
}

export function HeartSticker({ size = 40, style }: StickerProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg viewBox="0 0 60 60" width={size} height={size}>
        <Path
          d="M30 14 c-6-9 -22-6 -22 7 c0 12 14 21 22 31 c8-10 22-19 22-31 c0-13 -16-16 -22-7 z"
          fill="#FF6FA5"
          stroke="white"
          strokeWidth="3"
        />
      </Svg>
    </View>
  );
}

export function StarSticker({ size = 40, style }: StickerProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg viewBox="0 0 60 60" width={size} height={size}>
        <Path
          d="M30 5 l6 18 h19 l-15 11 6 18 -16-11 -16 11 6-18 -15-11 h19z"
          fill="#FFC83D"
          stroke="white"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

export function SparkleSticker({ size = 40, style }: StickerProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg viewBox="0 0 60 60" width={size} height={size}>
        <Path
          d="M30 8 l4 18 18 4 -18 4 -4 18 -4-18 -18-4 18-4z"
          fill="#A684FF"
          stroke="white"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

export function BowSticker({ size = 40, style }: StickerProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg viewBox="0 0 60 60" width={size} height={size}>
        <Path
          d="M10 20 Q20 10 30 30 Q20 50 10 40 Q5 30 10 20z"
          fill="#FF6FA5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <Path
          d="M50 20 Q40 10 30 30 Q40 50 50 40 Q55 30 50 20z"
          fill="#FF6FA5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <Circle cx="30" cy="30" r="5" fill="#FF8FA8" stroke="white" strokeWidth="2" />
      </Svg>
    </View>
  );
}

export function DaisySticker({ size = 40, style }: StickerProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg viewBox="0 0 60 60" width={size} height={size}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <Ellipse
            key={i}
            cx={30 + 12 * Math.cos((angle * Math.PI) / 180)}
            cy={30 + 12 * Math.sin((angle * Math.PI) / 180)}
            rx="7"
            ry="4"
            fill="white"
            stroke="#ECDDC3"
            strokeWidth="1"
            transform={`rotate(${angle} ${30 + 12 * Math.cos((angle * Math.PI) / 180)} ${30 + 12 * Math.sin((angle * Math.PI) / 180)})`}
          />
        ))}
        <Circle cx="30" cy="30" r="9" fill="#FFC83D" stroke="white" strokeWidth="2" />
      </Svg>
    </View>
  );
}

export function CloudSticker({ size = 40, style }: StickerProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg viewBox="0 0 60 60" width={size} height={size}>
        <Path
          d="M14 40 Q8 40 8 33 Q8 26 15 26 Q16 18 24 18 Q30 18 33 23 Q36 20 40 22 Q48 22 48 30 Q48 38 40 38z"
          fill="white"
          stroke="#C9DDC8"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

export function RibbonSticker({ size = 40, style }: StickerProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg viewBox="0 0 60 60" width={size} height={size}>
        <Rect x="22" y="15" width="16" height="30" rx="3" fill="#E8A8B5" stroke="white" strokeWidth="2" />
        <Path d="M22 25 L8 15 L12 30 L8 45 L22 35z" fill="#C66980" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        <Path d="M38 25 L52 15 L48 30 L52 45 L38 35z" fill="#C66980" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

interface WashiProps {
  color?: string;
  stripeColor?: string;
  width?: number;
  height?: number;
  rotate?: number;
  style?: object;
}

export function WashiTape({ color = '#FFD6E0', stripeColor = '#FF6FA5', width = 80, height = 18, rotate = 0, style }: WashiProps) {
  const stripes = Array.from({ length: 8 }, (_, i) => ({
    x1: -10 + i * (width / 6),
    x2: 10 + i * (width / 6),
  }));
  return (
    <View
      style={[
        {
          width,
          height,
          transform: [{ rotate: `${rotate}deg` }],
        },
        style,
      ]}
    >
      <Svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
        <Rect x="0" y="0" width={width} height={height} fill={color} opacity={0.85} />
        {stripes.map((s, i) => (
          <Line
            key={i}
            x1={s.x1}
            y1="0"
            x2={s.x2}
            y2={height}
            stroke={stripeColor}
            strokeWidth="1.5"
            opacity={0.35}
          />
        ))}
      </Svg>
    </View>
  );
}

export const StickerComponents: Record<string, React.ComponentType<StickerProps>> = {
  heart: HeartSticker,
  star: StarSticker,
  sparkle: SparkleSticker,
  bow: BowSticker,
  daisy: DaisySticker,
  cloud: CloudSticker,
  ribbon: RibbonSticker,
};
