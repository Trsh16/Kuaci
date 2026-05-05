import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PocaIcon } from '@/components/kuaci/PocaIcon';
import {
  HeartSticker, DaisySticker, StarSticker, CloudSticker,
  SparkleSticker, RibbonSticker, BowSticker,
} from '@/components/kuaci/Stickers';
import { Kuaci } from '@/constants/theme';

const FREE_TEMPLATES = [
  { id: 1, name: 'rose petal', bg: '#F2C8CD', accent: '#E8537A', Sticker: HeartSticker },
  { id: 2, name: 'sage day',   bg: '#C9DDC8', accent: '#6F8E5C', Sticker: DaisySticker },
  { id: 3, name: 'butter',     bg: '#F0D89C', accent: '#C49646', Sticker: StarSticker },
  { id: 4, name: 'old sky',    bg: '#B8C9D8', accent: '#5F7E96', Sticker: CloudSticker },
  { id: 5, name: 'lilac mist', bg: '#C9B8D8', accent: '#7E6499', Sticker: SparkleSticker },
] as const;

const PAID_TEMPLATES = [
  { id: 6,  name: 'kpop press',  bg: '#E8A8B5', accent: '#C66980', Sticker: RibbonSticker },
  { id: 7,  name: 'film grain',  bg: '#ECDDC3', accent: '#8B6F47', Sticker: BowSticker },
  { id: 8,  name: 'dust peach',  bg: '#E8B89A', accent: '#A06C4A', Sticker: StarSticker },
  { id: 9,  name: 'paperdoll',   bg: '#FAF1E1', accent: '#3B2A1A', Sticker: SparkleSticker },
  { id: 10, name: 'midnight',    bg: '#C9B8D8', accent: '#5A3D7E', Sticker: SparkleSticker },
  { id: 11, name: 'pine grove',  bg: '#B8C9A8', accent: '#4A6E4A', Sticker: DaisySticker },
  { id: 12, name: 'candy floss', bg: '#F2C8CD', accent: '#E8537A', Sticker: BowSticker },
] as const;

function TemplateCard({
  id, name, bg, accent, Sticker, locked, onPress,
}: {
  id: number; name: string; bg: string; accent: string;
  Sticker: React.ComponentType<{ size?: number }>;
  locked?: boolean; onPress: () => void;
}) {
  const isEven = id % 2 === 0;
  return (
    <TouchableOpacity
      style={[styles.card, { transform: [{ rotate: isEven ? '-0.4deg' : '0.4deg' }] }]}
      activeOpacity={locked ? 0.7 : 0.85}
      onPress={onPress}
    >
      <View style={[styles.cardCover, { backgroundColor: bg }]}>
        {locked && <View style={styles.lockedOverlay} />}
        <View style={locked ? styles.stickerDim : undefined}>
          <Sticker size={44} />
        </View>
        <View style={[styles.badge, locked ? { backgroundColor: Kuaci.ink1 } : { backgroundColor: Kuaci.paper1 }]}>
          {locked ? (
            <>
              <PocaIcon name="lock" size={9} color="#FAF1E1" strokeWidth={2.4} />
              <Text style={[styles.badgeText, { color: '#FAF1E1' }]}>$0.99</Text>
            </>
          ) : (
            <Text style={[styles.badgeText, { color: accent }]}>FREE</Text>
          )}
        </View>
        <Text style={styles.serial}>NO.{String(id).padStart(3, '0')}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardName}>{name}</Text>
        <View style={[styles.colorDot, { backgroundColor: accent }]} />
      </View>
    </TouchableOpacity>
  );
}

export default function TemplatesScreen() {
  const insets = useSafeAreaInsets();

  const handleUnlock = () => {
    Alert.alert(
      'unlock the shelf ♡',
      'Get all templates for $4.99 or unlock one at a time for $0.99 each.',
      [
        { text: 'unlock all — $4.99', onPress: () => {} },
        { text: 'maybe later', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={{ width: 36 }} />
        <Text style={styles.headerTitle}>TEMPLATES</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <PocaIcon name="search" size={20} color={Kuaci.ink1} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Free templates */}
        <Text style={styles.sectionLabel}>FREE · 5 TEMPLATES</Text>
        <View style={styles.grid}>
          {FREE_TEMPLATES.map(t => (
            <TemplateCard key={t.id} {...t} locked={false} onPress={() => {}} />
          ))}
        </View>

        {/* Unlock banner — full width, between free and paid */}
        <TouchableOpacity style={styles.unlockBanner} onPress={handleUnlock} activeOpacity={0.88}>
          <LinearGradient
            colors={[Kuaci.butter, Kuaci.blush]}
            style={styles.unlockGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {/* Punch holes */}
            <View style={[styles.punchHole, { left: -6 }]} />
            <View style={[styles.punchHole, { right: -6 }]} />

            <View style={styles.unlockLeft}>
              <Text style={styles.unlockEyebrow}>ADMIT ONE</Text>
              <Text style={styles.unlockTitle}>unlock {PAID_TEMPLATES.length} more</Text>
              <Text style={styles.unlockSub}>$0.99 each · or all for $4.99 ♡</Text>
            </View>
            <View style={styles.unlockRight}>
              <PocaIcon name="lock" size={22} color={Kuaci.ink2} strokeWidth={1.8} />
              <Text style={styles.unlockCta}>unlock →</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Paid templates */}
        <Text style={styles.sectionLabel}>PREMIUM · {PAID_TEMPLATES.length} TEMPLATES</Text>
        <View style={styles.grid}>
          {PAID_TEMPLATES.map(t => (
            <TemplateCard key={t.id} {...t} locked onPress={handleUnlock} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Kuaci.paper1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 999,
    borderWidth: 1.5, borderColor: Kuaci.paper3,
    backgroundColor: Kuaci.paper2,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 13, color: Kuaci.ink1, letterSpacing: 0.12,
  },
  scroll: { paddingHorizontal: 18, paddingBottom: 110 },
  sectionLabel: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 10, color: Kuaci.ink3,
    letterSpacing: 0.14, marginBottom: 12, marginTop: 4,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 20 },

  /* Template card */
  card: {
    width: '46%',
    backgroundColor: Kuaci.paper2,
    borderRadius: 6, borderWidth: 1.5, borderColor: Kuaci.paper3,
    padding: 8,
    shadowColor: Kuaci.ink2,
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 6,
    elevation: 2,
  },
  cardCover: {
    aspectRatio: 4 / 5, borderRadius: 4,
    borderWidth: 1, borderColor: 'rgba(75,40,30,0.18)',
    overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(59,42,26,0.18)',
  },
  stickerDim: { opacity: 0.5 },
  badge: {
    position: 'absolute', top: 6, right: 6,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 3,
    flexDirection: 'row', alignItems: 'center', gap: 3,
  },
  badgeText: { fontFamily: 'SpecialElite_400Regular', fontSize: 9, letterSpacing: 0.08 },
  serial: {
    position: 'absolute', bottom: 5, left: 6,
    fontFamily: 'SpecialElite_400Regular', fontSize: 7,
    color: 'rgba(75,40,30,0.55)', letterSpacing: 0.1,
  },
  cardFooter: {
    paddingTop: 8, paddingHorizontal: 4, paddingBottom: 4,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cardName: { fontFamily: 'Fredoka_600SemiBold', fontSize: 13, color: Kuaci.ink1 },
  colorDot: { width: 12, height: 12, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(75,40,30,0.2)' },

  /* Unlock banner */
  unlockBanner: { marginBottom: 20 },
  unlockGradient: {
    borderRadius: 6, borderWidth: 1.5, borderColor: Kuaci.ink2,
    borderStyle: 'dashed', padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    position: 'relative',
  },
  punchHole: {
    position: 'absolute', top: '50%', marginTop: -6,
    width: 12, height: 12, borderRadius: 999, backgroundColor: Kuaci.paper1,
  },
  unlockLeft: { flex: 1 },
  unlockEyebrow: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 9, color: Kuaci.ink2, letterSpacing: 0.14, marginBottom: 3,
  },
  unlockTitle: { fontFamily: 'Fredoka_600SemiBold', fontSize: 20, color: Kuaci.ink1 },
  unlockSub: { fontFamily: 'Caveat_400Regular', fontSize: 17, color: Kuaci.ink2, marginTop: 1 },
  unlockRight: { alignItems: 'center', gap: 4, paddingLeft: 12 },
  unlockCta: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 11, color: Kuaci.ink1, letterSpacing: 0.06,
  },
});
