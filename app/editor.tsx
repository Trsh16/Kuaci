import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Image, Share, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { PocaIcon } from '@/components/kuaci/PocaIcon';
import {
  HeartSticker, StarSticker, SparkleSticker,
  BowSticker, DaisySticker, CloudSticker, RibbonSticker, WashiTape,
} from '@/components/kuaci/Stickers';
import { Kuaci } from '@/constants/theme';

const FILTERS = ['none', 'film', 'sepia', 'warm', 'cool', 'b&w'] as const;
type Filter = (typeof FILTERS)[number];

// On web react-native-image filters aren't available, so we approximate with opacity tints
const FILTER_OVERLAY: Record<Filter, { color: string; opacity: number }> = {
  none:  { color: 'transparent', opacity: 0 },
  film:  { color: '#8B6F47', opacity: 0.12 },
  sepia: { color: '#8B6F47', opacity: 0.30 },
  warm:  { color: '#E8A05F', opacity: 0.15 },
  cool:  { color: '#7096B8', opacity: 0.15 },
  'b&w': { color: '#888888', opacity: 0.55 },
};

const FILTER_PREVIEW_COLORS: Record<Filter, [string, string]> = {
  none:  ['#F2C8CD', '#E8B89A'],
  film:  ['#E0BBA8', '#CCA892'],
  sepia: ['#C8A060', '#A87848'],
  warm:  ['#F0D098', '#E0B068'],
  cool:  ['#B0C8D8', '#C0D0D8'],
  'b&w': ['#C8C8C8', '#989898'],
};

const CAPTIONS = [
  'softest summer ♡',
  'chasing golden light~',
  'pressed flowers & polaroids',
  'my little world, just for me ♡',
  'collect every moment~',
  'sun-warmed and daydreaming',
  'this is the soft life ✦',
  'pages of something precious',
];

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
  { id: 'filter',  icon: 'filter',  label: 'FILTER' },
  { id: 'text',    icon: 'text',    label: 'TEXT' },
  { id: 'sticker', icon: 'sticker', label: 'STICKER' },
  { id: 'caption', icon: 'magic',   label: 'CAPTION' },
];

const APP_STORE_TAG = '\n\n📸 made with Kuaci — download on the App Store';

export default function EditorScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { uri, filter: initialFilter } = useLocalSearchParams<{ uri?: string; filter?: string }>();

  const [tab, setTab] = useState<Tab>('filter');
  const [filter, setFilter] = useState<Filter>((initialFilter as Filter) || 'film');
  const [activeSticker, setActiveSticker] = useState<number | null>(null);
  const [captionIndex, setCaptionIndex] = useState(0);
  const [showCaption, setShowCaption] = useState(false);
  const [saving, setSaving] = useState(false);

  const canvasRef = useRef<ViewShot>(null);

  const caption = CAPTIONS[captionIndex];
  const overlay = FILTER_OVERLAY[filter];
  const ActiveStickerComp = activeSticker !== null ? STICKERS[activeSticker].Component : null;

  const captureCanvas = async (): Promise<string | null> => {
    if (!canvasRef.current?.capture) return null;
    try {
      return await canvasRef.current.capture();
    } catch {
      return null;
    }
  };

  const saveToGallery = async () => {
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Allow photo library access to save your creation.');
        return;
      }
      const imageUri = await captureCanvas();
      if (!imageUri) { Alert.alert('Could not capture image'); return; }
      await MediaLibrary.saveToLibraryAsync(imageUri);
      Alert.alert('saved ✦', `saved to "soft summer" ✦`);
    } finally {
      setSaving(false);
    }
  };

  const shareImage = async () => {
    setSaving(true);
    try {
      const imageUri = await captureCanvas();
      if (!imageUri) { Alert.alert('Could not capture image'); return; }

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(imageUri, {
          mimeType: 'image/png',
          dialogTitle: 'share your card ♡',
          UTI: 'public.png',
        });
      } else {
        // Fallback: text share on web/simulator
        await Share.share({
          message: `${caption}${APP_STORE_TAG}`,
          title: 'kuaci card ♡',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const shareCaption = async () => {
    await Share.share({
      message: `${caption}${APP_STORE_TAG}`,
      title: 'kuaci caption ♡',
    });
  };

  const regenerateCaption = () => {
    setCaptionIndex(i => (i + 1) % CAPTIONS.length);
    setShowCaption(true);
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
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={saveToGallery} disabled={saving}>
            <PocaIcon name="photo" size={18} color={Kuaci.ink1} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={shareImage} disabled={saving}>
            {saving
              ? <ActivityIndicator size="small" color="#FAF1E1" />
              : <Text style={styles.saveBtnText}>SHARE</Text>
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* Canvas (captured by ViewShot) */}
      <ViewShot ref={canvasRef} options={{ format: 'png', quality: 1 }} style={styles.canvasOuter}>
        <View style={styles.canvasWrapper}>
          {/* Tape */}
          <View style={styles.canvasTape} pointerEvents="none">
            <WashiTape color="rgba(232,160,95,0.6)" stripeColor="#C49646" width={64} height={18} rotate={-6} />
          </View>

          <View style={styles.canvas}>
            {/* Photo or gradient placeholder */}
            {uri ? (
              <Image source={{ uri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
            ) : (
              <LinearGradient
                colors={['#F2C8CD', '#E8B89A', '#B8C9D8']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              />
            )}

            {/* Filter colour overlay */}
            {overlay.opacity > 0 && (
              <View style={[StyleSheet.absoluteFillObject, { backgroundColor: overlay.color, opacity: overlay.opacity }]} />
            )}

            {/* Sticker overlay */}
            {ActiveStickerComp && (
              <View style={styles.stickerOverlay} pointerEvents="none">
                <ActiveStickerComp size={44} style={{ transform: [{ rotate: '15deg' }] }} />
              </View>
            )}

            {/* Caption overlay */}
            {showCaption && (
              <Text style={styles.captionOverlay}>{caption}</Text>
            )}
          </View>

          {/* Stamp */}
          <Text style={styles.canvasStamp}>KUACI · 26.05.05 · NO.0042</Text>
        </View>
      </ViewShot>

      {/* Tab panel */}
      <View style={styles.panelArea}>
        {tab === 'filter' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {FILTERS.map(f => (
              <TouchableOpacity key={f} style={styles.filterItem} onPress={() => setFilter(f)}>
                <LinearGradient
                  colors={FILTER_PREVIEW_COLORS[f]}
                  style={[styles.filterThumb, filter === f && styles.filterThumbActive]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
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
                onPress={() => setActiveSticker(activeSticker === i ? null : i)}
              >
                <Component size={36} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {tab === 'caption' && (
          <View style={styles.captionPanel}>
            <LinearGradient colors={[Kuaci.butter, Kuaci.blush]} style={styles.captionCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={styles.captionText}>{caption}</Text>
              <Text style={styles.captionLabel}>
                {showCaption ? 'tap the card to overlay ♡' : 'AI-GENERATED CAPTION'}
              </Text>
              <View style={styles.captionActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={regenerateCaption}>
                  <PocaIcon name="magic" size={12} color={Kuaci.ink1} />
                  <Text style={styles.actionBtnText}>REGENERATE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => setShowCaption(v => !v)}>
                  <PocaIcon name="edit" size={12} color={Kuaci.ink1} />
                  <Text style={styles.actionBtnText}>{showCaption ? 'HIDE' : 'ADD TO CARD'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={shareCaption}>
                  <PocaIcon name="note" size={12} color={Kuaci.ink1} />
                  <Text style={styles.actionBtnText}>COPY & SHARE</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Share to apps row */}
            <Text style={styles.shareLabel}>SHARE TO</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shareApps}>
              {[
                { label: 'WhatsApp', color: '#25D366' },
                { label: 'Instagram', color: '#E8537A' },
                { label: 'Pinterest', color: '#E60023' },
                { label: 'Threads',  color: '#000000' },
                { label: 'X',        color: '#1DA1F2' },
              ].map(app => (
                <TouchableOpacity
                  key={app.label}
                  style={[styles.appChip, { borderColor: app.color }]}
                  onPress={shareImage}
                >
                  <Text style={[styles.appChipText, { color: app.color }]}>{app.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
            <PocaIcon name={t.icon as any} size={20} color={tab === t.id ? '#FAF1E1' : Kuaci.ink2} strokeWidth={2} />
            <Text style={[styles.tabLabel, tab === t.id && styles.tabLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Kuaci.paper1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 999,
    borderWidth: 1.5, borderColor: Kuaci.paper3,
    backgroundColor: Kuaci.paper2,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontFamily: 'SpecialElite_400Regular', fontSize: 13, color: Kuaci.ink1, letterSpacing: 0.12 },
  headerRight: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  saveBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4,
    borderWidth: 2, borderColor: Kuaci.ink1, backgroundColor: Kuaci.pink,
    shadowColor: Kuaci.ink1, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0,
    elevation: 3, minWidth: 64, alignItems: 'center',
  },
  saveBtnText: { fontFamily: 'SpecialElite_400Regular', fontSize: 11, color: '#FAF1E1', letterSpacing: 0.1 },

  canvasOuter: { marginHorizontal: 18, marginBottom: 6 },
  canvasWrapper: { position: 'relative', backgroundColor: Kuaci.paper1, padding: 4, borderRadius: 6 },
  canvasTape: { position: 'absolute', top: -6, left: '35%', zIndex: 5 },
  canvas: {
    borderRadius: 4, aspectRatio: 4 / 5, overflow: 'hidden',
    borderWidth: 1, borderColor: Kuaci.paper3,
    shadowColor: Kuaci.ink2, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14, shadowRadius: 8, elevation: 3,
  },
  stickerOverlay: { position: 'absolute', top: 18, right: 22 },
  captionOverlay: {
    position: 'absolute', bottom: 14, left: 14,
    fontFamily: 'Caveat_400Regular', fontSize: 22, color: '#FAF1E1',
    textShadowColor: 'rgba(0,0,0,0.35)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  canvasStamp: {
    fontFamily: 'SpecialElite_400Regular', fontSize: 9,
    color: Kuaci.ink3, letterSpacing: 0.14, textAlign: 'center', marginTop: 5,
  },

  panelArea: { flex: 1, paddingHorizontal: 18, paddingTop: 8 },
  filterRow: { gap: 10 },
  filterItem: { alignItems: 'center', gap: 4 },
  filterThumb: {
    width: 52, height: 52, borderRadius: 4,
    borderWidth: 1.5, borderColor: Kuaci.paper3,
  },
  filterThumbActive: { borderWidth: 2.5, borderColor: Kuaci.pink },
  filterName: { fontFamily: 'SpecialElite_400Regular', fontSize: 9, color: Kuaci.ink2, letterSpacing: 0.08 },
  filterNameActive: { color: Kuaci.pink },

  textGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  fontChip: {
    width: '47%', paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 4, borderWidth: 1.5, borderColor: Kuaci.paper3, backgroundColor: Kuaci.paper2,
  },
  fontChipText: { fontSize: 16, color: Kuaci.ink1 },

  stickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stickerChip: {
    width: '22%', aspectRatio: 1, borderRadius: 4,
    borderWidth: 1.5, borderColor: Kuaci.paper3, backgroundColor: Kuaci.paper2,
    alignItems: 'center', justifyContent: 'center',
  },
  stickerChipActive: { borderColor: Kuaci.pink, borderWidth: 2.5 },

  captionPanel: { flex: 1, gap: 12 },
  captionCard: { padding: 14, borderRadius: 6, borderWidth: 1.5, borderColor: Kuaci.paper3 },
  captionText: { fontFamily: 'Caveat_400Regular', fontSize: 20, color: Kuaci.ink1, marginBottom: 4 },
  captionLabel: { fontFamily: 'SpecialElite_400Regular', fontSize: 9, color: Kuaci.ink2, letterSpacing: 0.1, marginBottom: 10 },
  captionActions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4,
    borderWidth: 1.5, borderColor: Kuaci.ink1, backgroundColor: Kuaci.paper1,
  },
  actionBtnText: { fontFamily: 'SpecialElite_400Regular', fontSize: 9, color: Kuaci.ink1, letterSpacing: 0.1 },

  shareLabel: {
    fontFamily: 'SpecialElite_400Regular', fontSize: 9,
    color: Kuaci.ink3, letterSpacing: 0.12,
  },
  shareApps: { gap: 8 },
  appChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 4, borderWidth: 1.5,
    backgroundColor: Kuaci.paper2,
  },
  appChipText: { fontFamily: 'SpecialElite_400Regular', fontSize: 11, letterSpacing: 0.08 },

  tabBar: {
    flexDirection: 'row', margin: 18, marginTop: 6,
    backgroundColor: 'rgba(244,231,208,0.96)',
    borderRadius: 8, padding: 6,
    borderWidth: 1.5, borderColor: Kuaci.paper3,
    shadowColor: Kuaci.ink2, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 8,
    elevation: 4,
  },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 6, gap: 2 },
  tabItemActive: { backgroundColor: Kuaci.ink1 },
  tabLabel: { fontFamily: 'SpecialElite_400Regular', fontSize: 9, color: Kuaci.ink2, letterSpacing: 0.08 },
  tabLabelActive: { color: '#FAF1E1' },
});
