import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PocaIcon } from '@/components/kuaci/PocaIcon';
import { Kuaci } from '@/constants/theme';

const FILTERS = ['none', 'film', 'sepia', 'warm', 'cool', 'b&w'] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_COLORS: Record<Filter, [string, string]> = {
  none: ['#F2C8CD', '#E8B89A'],
  film: ['#E8C5B8', '#D4B09A'],
  sepia: ['#D4A882', '#B8896A'],
  warm: ['#F2D4A8', '#E8B87A'],
  cool: ['#B8C9D8', '#C9DDC8'],
  'b&w': ['#C8C8C8', '#989898'],
};

const STRIP_COLORS: [string, string][] = [
  ['#F2C8CD', '#E8B89A'],
  ['#E8B89A', '#B8C9D8'],
  ['#B8C9D8', '#C9DDC8'],
  ['#C9DDC8', '#F2C8CD'],
];

export default function PhotoboothScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('film');
  const [mode, setMode] = useState<'single' | 'strip'>('strip');
  const [flashOn, setFlashOn] = useState(false);

  const filterColors = FILTER_COLORS[filter];

  const handleCapture = () => {
    router.push('/editor');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.darkBtn} onPress={() => router.back()}>
          <PocaIcon name="close" size={20} color="#FAF1E1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PHOTOBOOTH</Text>
        <TouchableOpacity style={styles.darkBtn} onPress={() => setFlashOn(f => !f)}>
          <PocaIcon name="flash" size={20} color={flashOn ? Kuaci.butter : '#FAF1E1'} />
        </TouchableOpacity>
      </View>

      {/* Mode toggle */}
      <View style={styles.modeRow}>
        <View style={styles.modeToggle}>
          {(['single', 'strip'] as const).map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
              onPress={() => setMode(m)}
            >
              <Text style={[styles.modeBtnText, mode === m && styles.modeBtnTextActive]}>
                {m === 'single' ? 'SINGLE' : '4-UP STRIP'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Viewfinder */}
      {mode === 'single' ? (
        <View style={styles.viewfinderWrapper}>
          <LinearGradient
            colors={filterColors}
            style={styles.viewfinder}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Corner brackets */}
            {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h], i) => (
              <View
                key={i}
                style={[
                  styles.bracket,
                  v === 'top' ? { top: 14 } : { bottom: 14 },
                  h === 'left' ? { left: 14 } : { right: 14 },
                  {
                    borderTopWidth: v === 'top' ? 2 : 0,
                    borderBottomWidth: v === 'bottom' ? 2 : 0,
                    borderLeftWidth: h === 'left' ? 2 : 0,
                    borderRightWidth: h === 'right' ? 2 : 0,
                  },
                ]}
              />
            ))}
            {/* Focus ring */}
            <View style={styles.focusRing} />
            {/* Counter */}
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>03s</Text>
            </View>
            {/* Caption */}
            <Text style={styles.viewfinderCaption}>say cheese ♡</Text>
          </LinearGradient>
        </View>
      ) : (
        /* Strip mode */
        <View style={styles.stripWrapper}>
          <View style={styles.strip}>
            {STRIP_COLORS.map((cols, i) => (
              <LinearGradient
                key={i}
                colors={cols}
                style={styles.stripFrame}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.stripFrameNum}>0{i + 1}</Text>
              </LinearGradient>
            ))}
            <Text style={styles.stripStamp}>KUACI · 26.05.05</Text>
          </View>
        </View>
      )}

      {/* Filter strip */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>FILTERS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
                {f.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Shutter row */}
      <View style={[styles.shutterRow, { bottom: insets.bottom + 90 }]}>
        <TouchableOpacity style={styles.shutterSide}>
          <PocaIcon name="photo" size={22} color="#FAF1E1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.shutterBtn} onPress={handleCapture} activeOpacity={0.85}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.shutterSide}>
          <PocaIcon name="flip" size={22} color="#FAF1E1" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#3B2A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  darkBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: 'rgba(250,241,225,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 14,
    color: '#FAF1E1',
    letterSpacing: 0.12,
  },
  modeRow: {
    alignItems: 'center',
    marginBottom: 14,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(250,241,225,0.12)',
    borderRadius: 999,
    padding: 3,
  },
  modeBtn: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 999,
  },
  modeBtnActive: {
    backgroundColor: '#FAF1E1',
  },
  modeBtnText: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 11,
    color: 'rgba(250,241,225,0.75)',
    letterSpacing: 0.08,
  },
  modeBtnTextActive: {
    color: '#3B2A1A',
  },
  viewfinderWrapper: {
    marginHorizontal: 18,
    flex: 1,
    marginBottom: 8,
  },
  viewfinder: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 6,
    borderColor: '#FAF1E1',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  bracket: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderColor: '#FAF1E1',
  },
  focusRing: {
    width: 90,
    height: 90,
    borderRadius: 999,
    backgroundColor: 'rgba(58,42,26,0.18)',
    borderWidth: 2,
    borderColor: 'rgba(58,42,26,0.35)',
    borderStyle: 'dashed',
  },
  counterBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    backgroundColor: 'rgba(58,42,26,0.55)',
  },
  counterText: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 10,
    color: '#FAF1E1',
    letterSpacing: 0.1,
  },
  viewfinderCaption: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    fontFamily: 'Caveat_400Regular',
    fontSize: 22,
    color: '#FAF1E1',
  },
  stripWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginBottom: 8,
  },
  strip: {
    backgroundColor: '#FAF1E1',
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 28,
    borderRadius: 4,
    gap: 8,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  stripFrame: {
    height: 72,
    borderRadius: 2,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    padding: 6,
  },
  stripFrameNum: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 8,
    color: 'rgba(58,42,26,0.55)',
    letterSpacing: 0.1,
  },
  stripStamp: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 9,
    color: Kuaci.ink3,
    letterSpacing: 0.14,
    textAlign: 'center',
    marginTop: 4,
  },
  filterSection: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 8,
  },
  filterLabel: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 9,
    color: 'rgba(250,241,225,0.55)',
    letterSpacing: 0.12,
    marginBottom: 8,
  },
  filterRow: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(250,241,225,0.12)',
  },
  filterChipActive: {
    backgroundColor: '#FAF1E1',
  },
  filterChipText: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 11,
    color: 'rgba(250,241,225,0.85)',
    letterSpacing: 0.08,
  },
  filterChipTextActive: {
    color: '#3B2A1A',
  },
  shutterRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 36,
  },
  shutterSide: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(250,241,225,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterBtn: {
    width: 78,
    height: 78,
    borderRadius: 999,
    backgroundColor: '#FAF1E1',
    borderWidth: 4,
    borderColor: Kuaci.pink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Kuaci.pink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: Kuaci.pink,
  },
});
