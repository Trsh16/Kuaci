import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PocaIcon } from '@/components/kuaci/PocaIcon';
import {
  HeartSticker, StarSticker, SparkleSticker,
  BowSticker, DaisySticker, CloudSticker, RibbonSticker, WashiTape,
} from '@/components/kuaci/Stickers';
import { Kuaci } from '@/constants/theme';

const FILTERS = ['none', 'film', 'sepia', 'warm', 'cool', 'b&w'] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_PREVIEW_COLORS: Record<Filter, [string, string]> = {
  none: ['#F2C8CD', '#E8B89A'],
  film: ['#E0BBA8', '#CCA892'],
  sepia: ['#C8A060', '#A87848'],
  warm: ['#F0D098', '#E0B068'],
  cool: ['#B0C8D8', '#C0D0D8'],
  'b&w': ['#C8C8C8', '#989898'],
};

const FONTS = ['Caveat_400Regular', 'SpecialElite_400Regular', 'Fredoka_600SemiBold', 'Quicksand_600SemiBold'];
const FONT_LABELS = ['Caveat', 'Special Elite', 'Fredoka', 'Quicksand'];

const STICKERS = [
  { name: 'heart', Component: HeartSticker },
  { name: 'star', Component: StarSticker },
  { name: 'sparkle', Component: SparkleSticker },
  { name: 'bow', Component: BowSticker },
  { name: 'daisy', Component: DaisySticker },
  { name: 'cloud', Component: CloudSticker },
  { name: 'ribbon', Component: RibbonSticker },
];

type Tab = 'filter' | 'text' | 'sticker' | 'caption';

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'filter', icon: 'filter', label: 'FILTER' },
  { id: 'text', icon: 'text', label: 'TEXT' },
  { id: 'sticker', icon: 'sticker', label: 'STICKER' },
  { id: 'caption', icon: 'magic', label: 'CAPTION' },
];

export default function EditorScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('filter');
  const [filter, setFilter] = useState<Filter>('film');
  const [activeSticker, setActiveSticker] = useState(0);

  const handleSave = () => {
    router.back();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <PocaIcon name="close" size={20} color={Kuaci.ink1} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EDIT</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>SAVE</Text>
        </TouchableOpacity>
      </View>

      {/* Canvas */}
      <View style={styles.canvasWrapper}>
        {/* Tape across top */}
        <View style={styles.canvasTape} pointerEvents="none">
          <WashiTape color="rgba(232,160,95,0.6)" stripeColor="#C49646" width={64} height={18} rotate={-6} />
        </View>

        <LinearGradient
          colors={['#F2C8CD', '#E8B89A', '#B8C9D8']}
          style={styles.canvas}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Overlay sticker */}
          <View style={styles.canvasStickerOverlay} pointerEvents="none">
            <HeartSticker size={44} style={{ transform: [{ rotate: '15deg' }] }} />
          </View>
          {/* Caption overlay */}
          <Text style={styles.canvasCaption}>softest summer ♡</Text>
        </LinearGradient>

        <Text style={styles.canvasStamp}>KUACI · 26.05.05 · NO.0042</Text>
      </View>

      {/* Tab panel content */}
      <View style={styles.panelArea}>
        {tab === 'filter' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                style={styles.filterItem}
                onPress={() => setFilter(f)}
              >
                <LinearGradient
                  colors={FILTER_PREVIEW_COLORS[f]}
                  style={[styles.filterThumb, filter === f && styles.filterThumbActive]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <Text style={[styles.filterName, filter === f && styles.filterNameActive]}>
                  {f.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {tab === 'text' && (
          <View style={styles.textGrid}>
            {FONTS.map((font, i) => (
              <TouchableOpacity key={font} style={styles.fontChip}>
                <Text style={[styles.fontChipText, { fontFamily: font }]}>
                  Aa · {FONT_LABELS[i]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {tab === 'sticker' && (
          <View style={styles.stickerGrid}>
            {STICKERS.map(({ name, Component }, i) => (
              <TouchableOpacity
                key={name}
                style={[styles.stickerChip, activeSticker === i && styles.stickerChipActive]}
                onPress={() => setActiveSticker(i)}
              >
                <Component size={36} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {tab === 'caption' && (
          <View style={styles.captionPanel}>
            <LinearGradient
              colors={[Kuaci.butter, Kuaci.blush]}
              style={styles.captionCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.captionText}>softest summer ♡</Text>
              <Text style={styles.captionLabel}>AI-GENERATED CAPTION</Text>
              <TouchableOpacity style={styles.regenBtn}>
                <PocaIcon name="magic" size={12} color={Kuaci.ink1} />
                <Text style={styles.regenText}>REGENERATE</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </View>

      {/* Bottom tab bar */}
      <View style={[styles.tabBar, { paddingBottom: insets.bottom + 6 }]}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tabItem, tab === t.id && styles.tabItemActive]}
            onPress={() => setTab(t.id)}
          >
            <PocaIcon
              name={t.icon as any}
              size={20}
              color={tab === t.id ? '#FAF1E1' : Kuaci.ink2}
              strokeWidth={2}
            />
            <Text style={[styles.tabLabel, tab === t.id && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Kuaci.paper1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
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
  headerTitle: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 13,
    color: Kuaci.ink1,
    letterSpacing: 0.12,
  },
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Kuaci.ink1,
    backgroundColor: Kuaci.pink,
    shadowColor: Kuaci.ink1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  saveBtnText: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 11,
    color: '#FAF1E1',
    letterSpacing: 0.1,
  },
  canvasWrapper: {
    marginHorizontal: 18,
    marginBottom: 8,
    position: 'relative',
  },
  canvasTape: {
    position: 'absolute',
    top: -6,
    left: '35%',
    zIndex: 5,
  },
  canvas: {
    borderRadius: 4,
    aspectRatio: 4 / 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Kuaci.paper3,
    shadowColor: Kuaci.ink2,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },
  canvasStickerOverlay: {
    position: 'absolute',
    top: 18,
    right: 22,
  },
  canvasCaption: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    fontFamily: 'Caveat_400Regular',
    fontSize: 24,
    color: '#FAF1E1',
  },
  canvasStamp: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 9,
    color: Kuaci.ink3,
    letterSpacing: 0.14,
    textAlign: 'center',
    marginTop: 6,
  },
  panelArea: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  filterRow: {
    gap: 10,
  },
  filterItem: {
    alignItems: 'center',
    gap: 4,
  },
  filterThumb: {
    width: 56,
    height: 56,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Kuaci.paper3,
  },
  filterThumbActive: {
    borderWidth: 2.5,
    borderColor: Kuaci.pink,
  },
  filterName: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 9,
    color: Kuaci.ink2,
    letterSpacing: 0.08,
  },
  filterNameActive: {
    color: Kuaci.pink,
  },
  textGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  fontChip: {
    width: '47%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Kuaci.paper3,
    backgroundColor: Kuaci.paper2,
  },
  fontChipText: {
    fontSize: 16,
    color: Kuaci.ink1,
  },
  stickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stickerChip: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Kuaci.paper3,
    backgroundColor: Kuaci.paper2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerChipActive: {
    borderColor: Kuaci.pink,
    borderWidth: 2.5,
  },
  captionPanel: {
    flex: 1,
  },
  captionCard: {
    padding: 14,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Kuaci.paper3,
    gap: 6,
  },
  captionText: {
    fontFamily: 'Caveat_400Regular',
    fontSize: 22,
    color: Kuaci.ink1,
  },
  captionLabel: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 10,
    color: Kuaci.ink2,
    letterSpacing: 0.1,
  },
  regenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Kuaci.ink1,
    backgroundColor: Kuaci.paper1,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  regenText: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 10,
    color: Kuaci.ink1,
    letterSpacing: 0.1,
  },
  tabBar: {
    flexDirection: 'row',
    margin: 18,
    marginTop: 6,
    backgroundColor: 'rgba(244,231,208,0.96)',
    borderRadius: 8,
    padding: 6,
    borderWidth: 1.5,
    borderColor: Kuaci.paper3,
    shadowColor: Kuaci.ink2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 2,
  },
  tabItemActive: {
    backgroundColor: Kuaci.ink1,
  },
  tabLabel: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 9,
    color: Kuaci.ink2,
    letterSpacing: 0.08,
  },
  tabLabelActive: {
    color: '#FAF1E1',
  },
});
