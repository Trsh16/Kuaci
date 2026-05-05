import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PocaIcon } from '@/components/kuaci/PocaIcon';
import {
  HeartSticker, DaisySticker, StarSticker, CloudSticker,
  SparkleSticker, RibbonSticker, BowSticker,
} from '@/components/kuaci/Stickers';
import { Kuaci } from '@/constants/theme';

const TEMPLATES = [
  { id: 1, name: 'rose petal', bg: '#F2C8CD', accent: '#E8537A', free: true, Sticker: HeartSticker },
  { id: 2, name: 'sage day', bg: '#C9DDC8', accent: '#6F8E5C', free: true, Sticker: DaisySticker },
  { id: 3, name: 'butter', bg: '#F0D89C', accent: '#C49646', free: true, Sticker: StarSticker },
  { id: 4, name: 'old sky', bg: '#B8C9D8', accent: '#5F7E96', free: true, Sticker: CloudSticker },
  { id: 5, name: 'lilac mist', bg: '#C9B8D8', accent: '#7E6499', free: true, Sticker: SparkleSticker },
  { id: 6, name: 'kpop press', bg: '#E8A8B5', accent: '#C66980', free: false, Sticker: RibbonSticker },
  { id: 7, name: 'film grain', bg: '#ECDDC3', accent: '#8B6F47', free: false, Sticker: BowSticker },
  { id: 8, name: 'dust peach', bg: '#E8B89A', accent: '#A06C4A', free: false, Sticker: StarSticker },
  { id: 9, name: 'paperdoll', bg: '#FAF1E1', accent: '#3B2A1A', free: false, Sticker: SparkleSticker },
] as const;

type TabFilter = 'all' | 'free' | 'premium';

export default function TemplatesScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabFilter>('all');

  const filtered = TEMPLATES.filter(t => {
    if (tab === 'free') return t.free;
    if (tab === 'premium') return !t.free;
    return true;
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 36 }} />
        <Text style={styles.headerTitle}>TEMPLATES</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <PocaIcon name="search" size={20} color={Kuaci.ink1} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero ticket */}
        <LinearGradient
          colors={[Kuaci.butter, Kuaci.blush]}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.heroEyebrow}>ADMIT ONE · TEMPLATES</Text>
          <Text style={styles.heroTitle}>5 free, then $0.99 each</Text>
          <Text style={styles.heroSub}>unlock the whole shelf for $4.99 ♡</Text>
          {/* Punch holes */}
          <View style={[styles.punchHole, { left: -6 }]} />
          <View style={[styles.punchHole, { right: -6 }]} />
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {(['all', 'free', 'premium'] as TabFilter[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tabChip, tab === t && styles.tabChipActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabChipText, tab === t && styles.tabChipTextActive]}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Template grid */}
        <View style={styles.grid}>
          {filtered.map((template, i) => {
            const { Sticker } = template;
            const isEven = i % 2 === 0;
            return (
              <TouchableOpacity
                key={template.id}
                style={[styles.templateCard, { transform: [{ rotate: isEven ? '-0.4deg' : '0.4deg' }] }]}
                activeOpacity={0.85}
              >
                <View style={[styles.templateCover, { backgroundColor: template.bg }]}>
                  {/* Sticker center */}
                  <View style={styles.templateStickerCenter}>
                    <Sticker size={44} />
                  </View>

                  {/* Badge */}
                  {template.free ? (
                    <View style={[styles.badge, { backgroundColor: Kuaci.paper1 }]}>
                      <Text style={[styles.badgeText, { color: template.accent }]}>FREE</Text>
                    </View>
                  ) : (
                    <View style={[styles.badge, { backgroundColor: Kuaci.ink1 }]}>
                      <PocaIcon name="lock" size={9} color="#FAF1E1" strokeWidth={2.4} />
                      <Text style={[styles.badgeText, { color: '#FAF1E1' }]}>$0.99</Text>
                    </View>
                  )}

                  {/* Serial */}
                  <Text style={styles.templateSerial}>NO.{String(template.id).padStart(3, '0')}</Text>
                </View>

                <View style={styles.templateFooter}>
                  <Text style={styles.templateName}>{template.name}</Text>
                  <View style={[styles.colorDot, { backgroundColor: template.accent }]} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 100,
  },
  hero: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Kuaci.ink2,
    borderStyle: 'dashed',
    shadowColor: Kuaci.ink2,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 0,
    elevation: 2,
    position: 'relative',
  },
  heroEyebrow: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 10,
    color: Kuaci.ink2,
    letterSpacing: 0.14,
    marginBottom: 4,
  },
  heroTitle: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 18,
    color: Kuaci.ink1,
  },
  heroSub: {
    fontFamily: 'Caveat_400Regular',
    fontSize: 18,
    color: Kuaci.ink2,
    marginTop: 2,
  },
  punchHole: {
    position: 'absolute',
    top: '50%',
    marginTop: -6,
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: Kuaci.paper1,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tabChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Kuaci.paper3,
    backgroundColor: Kuaci.paper2,
  },
  tabChipActive: {
    backgroundColor: Kuaci.ink1,
    borderColor: Kuaci.ink1,
  },
  tabChipText: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 11,
    color: Kuaci.ink2,
    letterSpacing: 0.1,
  },
  tabChipTextActive: {
    color: '#FAF1E1',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  templateCard: {
    width: '46%',
    backgroundColor: Kuaci.paper2,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Kuaci.paper3,
    padding: 8,
    shadowColor: Kuaci.ink2,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  templateCover: {
    aspectRatio: 4 / 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(75,40,30,0.18)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  templateStickerCenter: {
    opacity: 0.85,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  badgeText: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 9,
    letterSpacing: 0.08,
  },
  templateSerial: {
    position: 'absolute',
    bottom: 5,
    left: 6,
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 7,
    color: 'rgba(75,40,30,0.55)',
    letterSpacing: 0.1,
  },
  templateFooter: {
    paddingTop: 8,
    paddingHorizontal: 4,
    paddingBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateName: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 13,
    color: Kuaci.ink1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(75,40,30,0.2)',
  },
});
