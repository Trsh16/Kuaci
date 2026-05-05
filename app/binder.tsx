import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  PanResponder, Animated, Dimensions, StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { PocaIcon } from '@/components/kuaci/PocaIcon';
import { WashiTape } from '@/components/kuaci/Stickers';
import { Kuaci } from '@/constants/theme';

const SLOTS_PER_PAGE = 9;

const PLACEHOLDER_COLORS: [string, string][] = [
  ['#F2C8CD', '#FFE4CC'],
  ['#C9DDC8', '#F0D89C'],
  ['#B8C9D8', '#E8A8B5'],
  ['#F0D89C', '#E8B89A'],
  ['#C9B8D8', '#B8C9A8'],
  ['#E8B89A', '#F2C8CD'],
];

// Split a flat array of URIs (or nulls) into pages of SLOTS_PER_PAGE,
// always ensuring at least one trailing empty slot so user can add more.
function buildPages(uris: (string | null)[]): (string | null)[][] {
  const withTrailing = [...uris, null]; // always one empty slot at end
  const pages: (string | null)[][] = [];
  for (let i = 0; i < withTrailing.length; i += SLOTS_PER_PAGE) {
    pages.push(withTrailing.slice(i, i + SLOTS_PER_PAGE));
  }
  // Pad last page to full 9 so grid is consistent
  const last = pages[pages.length - 1];
  while (last.length < SLOTS_PER_PAGE) last.push(null);
  return pages;
}

function PhotoSlot({
  uri, colorIndex, onPress, onLongPress,
}: {
  uri: string | null; colorIndex: number;
  onPress: () => void; onLongPress?: () => void;
}) {
  if (uri) {
    return (
      <TouchableOpacity style={styles.photoCard} onPress={onPress} onLongPress={onLongPress} activeOpacity={0.85}>
        <Image source={{ uri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      </TouchableOpacity>
    );
  }
  // Empty slot — tap to add
  return (
    <TouchableOpacity style={[styles.photoCard, styles.emptySlot]} onPress={onPress} activeOpacity={0.7}>
      <LinearGradient
        colors={PLACEHOLDER_COLORS[colorIndex % PLACEHOLDER_COLORS.length]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      />
      <View style={styles.addIcon}>
        <PocaIcon name="plus" size={18} color="rgba(75,40,30,0.4)" strokeWidth={2} />
      </View>
    </TouchableOpacity>
  );
}

export default function BinderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { title, color, accent } = useLocalSearchParams<{
    title: string; color: string; accent: string;
  }>();

  const [photos, setPhotos] = useState<(string | null)[]>([]);
  const [page, setPage] = useState(0);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const isFlipping = useRef(false);
  const pageRef = useRef(0);
  pageRef.current = page;

  const pages = buildPages(photos);

  const coverColor = color || Kuaci.blush;
  const accentColor = accent || Kuaci.pink;

  const pickPhoto = async (slotIndex: number) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo library access to add photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      allowsEditing: true,
      aspect: [5, 7],
    });
    if (result.canceled || !result.assets[0]) return;

    const globalIndex = pageRef.current * SLOTS_PER_PAGE + slotIndex;
    setPhotos(prev => {
      const next = [...prev];
      // Extend array if needed
      while (next.length <= globalIndex) next.push(null);
      next[globalIndex] = result.assets[0].uri;
      return next;
    });
  };

  const removePhoto = (slotIndex: number) => {
    const globalIndex = pageRef.current * SLOTS_PER_PAGE + slotIndex;
    Alert.alert('Remove photo?', '', [
      {
        text: 'Remove', style: 'destructive',
        onPress: () => setPhotos(prev => {
          const next = [...prev];
          next[globalIndex] = null;
          return next;
        }),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const flipPage = (direction: 'next' | 'prev') => {
    if (isFlipping.current) return;
    const current = pageRef.current;
    if (direction === 'next' && current >= pages.length - 1) return;
    if (direction === 'prev' && current <= 0) return;

    isFlipping.current = true;
    Animated.timing(flipAnim, {
      toValue: direction === 'next' ? 1 : -1,
      duration: 420,
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

  const currentPage = pages[page] ?? Array(SLOTS_PER_PAGE).fill(null);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <PocaIcon name="chevron-left" size={20} color={Kuaci.ink1} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || 'binder'}</Text>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.push({ pathname: '/photobooth' })}
        >
          <PocaIcon name="camera" size={20} color={Kuaci.ink1} />
        </TouchableOpacity>
      </View>

      {/* Page indicator */}
      <Text style={styles.pageIndicator}>
        PAGE {String(page + 1).padStart(2, '0')} OF {String(pages.length).padStart(2, '0')}
        {'  ·  '}
        {photos.filter(Boolean).length} CARDS
      </Text>

      {/* Book spread */}
      <View style={styles.bookWrapper} {...panResponder.panHandlers}>
        <LinearGradient
          colors={[coverColor + 'CC', coverColor + '77']}
          style={styles.book}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          {/* Binder rings */}
          <View style={styles.ringsContainer}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <View key={i} style={[styles.binderRing, { borderColor: accentColor }]} />
            ))}
          </View>

          {/* Tape */}
          <View style={styles.tapeOnBook} pointerEvents="none">
            <WashiTape color="rgba(232,160,95,0.55)" stripeColor="#C49646" width={64} height={18} rotate={-6} />
          </View>

          {/* Spine */}
          <View style={styles.spine} />

          {/* Page content */}
          <Animated.View
            style={[
              styles.pageAnimContainer,
              { transform: [{ perspective: 1200 }, { rotateY }] },
            ]}
          >
            <View style={styles.pageGrid}>
              {currentPage.map((uri, idx) => (
                <PhotoSlot
                  key={idx}
                  uri={uri}
                  colorIndex={page * SLOTS_PER_PAGE + idx}
                  onPress={() => {
                    if (uri) {
                      router.push({ pathname: '/editor', params: { uri } });
                    } else {
                      pickPhoto(idx);
                    }
                  }}
                  onLongPress={uri ? () => removePhoto(idx) : undefined}
                />
              ))}
            </View>
          </Animated.View>
        </LinearGradient>
      </View>

      {/* Nav row */}
      <View style={[styles.navRow, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity
          style={[styles.iconBtn, page === 0 && styles.dimmed]}
          onPress={() => flipPage('prev')}
          disabled={page === 0}
        >
          <PocaIcon name="chevron-left" size={20} color={page === 0 ? Kuaci.ink3 : Kuaci.ink1} />
        </TouchableOpacity>

        <Text style={styles.swipeHint}>swipe to flip ♡</Text>

        <TouchableOpacity
          style={[styles.iconBtn, page === pages.length - 1 && styles.dimmed]}
          onPress={() => flipPage('next')}
          disabled={page === pages.length - 1}
        >
          <PocaIcon name="chevron-right" size={20} color={page === pages.length - 1 ? Kuaci.ink3 : Kuaci.ink1} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1, backgroundColor: Kuaci.paper1, paddingHorizontal: 18,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 14,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 999,
    borderWidth: 1.5, borderColor: Kuaci.paper3,
    backgroundColor: Kuaci.paper2,
    alignItems: 'center', justifyContent: 'center',
  },
  dimmed: { opacity: 0.4 },
  headerTitle: { fontFamily: 'Fredoka_600SemiBold', fontSize: 17, color: Kuaci.ink1 },
  pageIndicator: {
    fontFamily: 'SpecialElite_400Regular', fontSize: 10,
    color: Kuaci.ink3, letterSpacing: 0.1,
    textAlign: 'center', marginBottom: 12,
  },
  bookWrapper: { flex: 1, marginBottom: 12, overflow: 'visible' },
  book: {
    flex: 1, borderRadius: 10, padding: 8,
    borderWidth: 1.5, borderColor: 'rgba(75,40,30,0.18)',
    overflow: 'hidden', position: 'relative',
  },
  ringsContainer: {
    position: 'absolute', left: -6, top: 24, bottom: 24,
    justifyContent: 'space-around', alignItems: 'center', zIndex: 4,
  },
  binderRing: {
    width: 13, height: 13, borderRadius: 999,
    backgroundColor: Kuaci.paper2, borderWidth: 1.5,
  },
  tapeOnBook: { position: 'absolute', top: -4, left: '38%', zIndex: 6 },
  spine: {
    position: 'absolute', top: 8, bottom: 8, left: '50%',
    width: 2, backgroundColor: 'rgba(75,40,30,0.14)', zIndex: 5,
  },
  pageAnimContainer: {
    flex: 1, borderRadius: 6, overflow: 'hidden', backgroundColor: Kuaci.paper1,
  },
  pageGrid: {
    flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 8, gap: 6,
  },
  photoCard: {
    width: '31%', aspectRatio: 5 / 7, borderRadius: 4, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(75,40,30,0.2)',
    shadowColor: Kuaci.ink2,
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 2,
    elevation: 2,
  },
  emptySlot: { alignItems: 'center', justifyContent: 'center' },
  addIcon: {
    width: 28, height: 28, borderRadius: 999,
    borderWidth: 1.5, borderColor: 'rgba(75,40,30,0.25)',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  navRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
  },
  swipeHint: { fontFamily: 'Caveat_400Regular', fontSize: 18, color: Kuaci.ink2 },
});
