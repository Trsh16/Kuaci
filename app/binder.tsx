import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  PanResponder, Animated, Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PocaIcon } from '@/components/kuaci/PocaIcon';
import { WashiTape } from '@/components/kuaci/Stickers';
import { Kuaci } from '@/constants/theme';

const PHOTO_COLORS = [
  ['#F2C8CD', '#FFE4CC'],
  ['#C9DDC8', '#F0D89C'],
  ['#B8C9D8', '#E8A8B5'],
  ['#F0D89C', '#E8B89A'],
  ['#C9B8D8', '#B8C9A8'],
  ['#E8B89A', '#F2C8CD'],
];

const ALL_PHOTOS = [...Array(9)].map((_, i) => ({
  id: i,
  colors: PHOTO_COLORS[i % PHOTO_COLORS.length] as [string, string],
}));

const PAGES = [
  ALL_PHOTOS.slice(0, 9),
  [...ALL_PHOTOS.slice(3, 9), ...ALL_PHOTOS.slice(0, 3)],
  [...ALL_PHOTOS.slice(1, 9), ALL_PHOTOS[0]],
];

const { width: SCREEN_W } = Dimensions.get('window');
const GRID_SIZE = (SCREEN_W - 36 - 36) / 3;

function PhotoCard({ colors, onPress }: { colors: [string, string]; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.photoCard} onPress={onPress} activeOpacity={0.85}>
      <LinearGradient
        colors={colors}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </TouchableOpacity>
  );
}

export default function BinderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { title, color, accent } = useLocalSearchParams<{
    title: string; color: string; accent: string;
  }>();

  const [page, setPage] = useState(0);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const isFlipping = useRef(false);
  // Ref keeps page current inside the stable panResponder closure
  const pageRef = useRef(0);
  pageRef.current = page;

  const coverColor = (color as string) || Kuaci.blush;
  const accentColor = (accent as string) || Kuaci.pink;

  const flipPage = (direction: 'next' | 'prev') => {
    if (isFlipping.current) return;
    const current = pageRef.current;
    if (direction === 'next' && current >= PAGES.length - 1) return;
    if (direction === 'prev' && current <= 0) return;

    isFlipping.current = true;
    const toValue = direction === 'next' ? 1 : -1;

    Animated.timing(flipAnim, {
      toValue,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setPage(p => direction === 'next' ? p + 1 : p - 1);
      flipAnim.setValue(0);
      isFlipping.current = false;
    });
  };

  const flipPageRef = useRef(flipPage);
  flipPageRef.current = flipPage;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -40) flipPageRef.current('next');
        else if (dx > 40) flipPageRef.current('prev');
      },
    })
  ).current;

  const rotateY = flipAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['170deg', '0deg', '-170deg'],
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <PocaIcon name="chevron-left" size={20} color={Kuaci.ink1} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || 'kpop'}</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <PocaIcon name="menu" size={20} color={Kuaci.ink1} />
        </TouchableOpacity>
      </View>

      {/* Page indicator */}
      <Text style={styles.pageIndicator}>
        PAGE {String(page + 1).padStart(2, '0')} OF {String(PAGES.length).padStart(2, '0')}
      </Text>

      {/* Book spread */}
      <View style={styles.bookWrapper} {...panResponder.panHandlers}>
        <LinearGradient
          colors={[coverColor + 'CC', coverColor + '77']}
          style={styles.book}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Binder rings */}
          <View style={styles.ringsContainer}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <View key={i} style={[styles.binderRing, { borderColor: accentColor }]} />
            ))}
          </View>

          {/* Tape decoration */}
          <View style={styles.tapeOnBook} pointerEvents="none">
            <WashiTape color="rgba(232,160,95,0.55)" stripeColor="#C49646" width={64} height={18} rotate={-6} />
          </View>

          {/* Center spine */}
          <View style={styles.spine} />

          {/* Page content */}
          <Animated.View
            style={[
              styles.pageAnimContainer,
              { transform: [{ perspective: 1200 }, { rotateY }] },
            ]}
          >
            <View style={styles.pageGrid}>
              {PAGES[page].map((photo, idx) => (
                <PhotoCard
                  key={idx}
                  colors={photo.colors}
                  onPress={() => router.push({ pathname: '/editor', params: { mode: 'view' } })}
                />
              ))}
            </View>
          </Animated.View>
        </LinearGradient>
      </View>

      {/* Navigation row */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.iconBtn, page === 0 && styles.disabled]}
          onPress={() => flipPage('prev')}
          disabled={page === 0}
        >
          <PocaIcon name="chevron-left" size={20} color={page === 0 ? Kuaci.ink3 : Kuaci.ink1} />
        </TouchableOpacity>

        <Text style={styles.swipeHint}>swipe to flip ♡</Text>

        <TouchableOpacity
          style={[styles.iconBtn, page === PAGES.length - 1 && styles.disabled]}
          onPress={() => flipPage('next')}
          disabled={page === PAGES.length - 1}
        >
          <PocaIcon name="chevron-right" size={20} color={page === PAGES.length - 1 ? Kuaci.ink3 : Kuaci.ink1} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Kuaci.paper1,
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Kuaci.paper3,
    backgroundColor: Kuaci.paper2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  headerTitle: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 17,
    color: Kuaci.ink1,
  },
  pageIndicator: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 10,
    color: Kuaci.ink3,
    letterSpacing: 0.12,
    textAlign: 'center',
    marginBottom: 12,
  },
  bookWrapper: {
    flex: 1,
    marginBottom: 16,
    overflow: 'visible',
  },
  book: {
    flex: 1,
    borderRadius: 10,
    padding: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(75,40,30,0.18)',
    position: 'relative',
    overflow: 'hidden',
  },
  ringsContainer: {
    position: 'absolute',
    left: -6,
    top: 28,
    bottom: 28,
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 4,
  },
  binderRing: {
    width: 13,
    height: 13,
    borderRadius: 999,
    backgroundColor: Kuaci.paper2,
    borderWidth: 1.5,
  },
  tapeOnBook: {
    position: 'absolute',
    top: -4,
    left: '38%',
    zIndex: 6,
  },
  spine: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    left: '50%',
    width: 2,
    backgroundColor: 'rgba(75,40,30,0.15)',
    zIndex: 5,
  },
  pageAnimContainer: {
    flex: 1,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: Kuaci.paper1,
  },
  pageGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 7,
  },
  photoCard: {
    width: '31%',
    aspectRatio: 5 / 7,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(75,40,30,0.2)',
    shadowColor: Kuaci.ink2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  swipeHint: {
    fontFamily: 'Caveat_400Regular',
    fontSize: 18,
    color: Kuaci.ink2,
  },
});
