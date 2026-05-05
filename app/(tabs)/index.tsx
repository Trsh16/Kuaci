import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Pressable, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PocaIcon } from '@/components/kuaci/PocaIcon';
import {
  HeartSticker, StarSticker, SparkleSticker,
  BowSticker, CloudSticker, DaisySticker, WashiTape,
} from '@/components/kuaci/Stickers';
import { Kuaci } from '@/constants/theme';

const ALBUMS = [
  {
    id: 1, title: 'kpop', sub: 'photocards · 24',
    color: '#F2C8CD', accent: '#E8537A',
    Sticker: HeartSticker, tapeColor: 'rgba(232,168,181,0.75)', tapeStripe: '#E8537A',
  },
  {
    id: 2, title: 'pokémon', sub: 'tcg · 38',
    color: '#F0D89C', accent: '#C49646',
    Sticker: StarSticker, tapeColor: 'rgba(232,160,95,0.70)', tapeStripe: '#C49646',
  },
  {
    id: 3, title: 'popmart', sub: 'figures · 12',
    color: '#C9B8D8', accent: '#7E6499',
    Sticker: SparkleSticker, tapeColor: 'rgba(201,184,216,0.75)', tapeStripe: '#7E6499',
  },
  {
    id: 4, title: 'sanrio', sub: 'stickers · 18',
    color: '#E8A8B5', accent: '#C66980',
    Sticker: BowSticker, tapeColor: 'rgba(232,168,181,0.75)', tapeStripe: '#C66980',
  },
  {
    id: 5, title: 'tamagotchi', sub: 'pixel · 9',
    color: '#B8C9A8', accent: '#6F8E5C',
    Sticker: CloudSticker, tapeColor: 'rgba(184,201,168,0.65)', tapeStripe: '#6F8E5C',
  },
  {
    id: 6, title: 'monchhichi', sub: 'plush · 6',
    color: '#E8B89A', accent: '#A06C4A',
    Sticker: DaisySticker, tapeColor: 'rgba(232,184,154,0.70)', tapeStripe: '#A06C4A',
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>kuaci</Text>
            <Text style={styles.brandSub}>YOUR LITTLE BINDER ♡</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <PocaIcon name="search" size={20} color={Kuaci.ink1} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <PocaIcon name="bell" size={20} color={Kuaci.ink1} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section label */}
        <View style={styles.sectionRow}>
          <View>
            <Text style={styles.sectionTitle}>your shelf</Text>
            <Text style={styles.sectionSub}>{ALBUMS.length} ALBUMS · EST. 2026</Text>
          </View>
          <Text style={styles.seeAll}>SEE ALL →</Text>
        </View>

        {/* Album grid */}
        <View style={styles.grid}>
          {ALBUMS.map((album, i) => (
            <AlbumCard
              key={album.id}
              album={album}
              index={i}
              onPress={() => router.push({ pathname: '/binder', params: { id: album.id, title: album.title, color: album.color, accent: album.accent } })}
            />
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 90 }]}
        onPress={() => router.push('/photobooth')}
        activeOpacity={0.85}
      >
        <PocaIcon name="plus" size={28} color={Kuaci.ink1} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

function AlbumCard({ album, index, onPress }: { album: typeof ALBUMS[0]; index: number; onPress: () => void }) {
  const isEven = index % 2 === 0;
  const { Sticker } = album;

  return (
    <Pressable
      style={[styles.albumCard, { transform: [{ rotate: isEven ? '-0.6deg' : '0.6deg' }] }]}
      onPress={onPress}
    >
      {/* Washi tape */}
      <View style={styles.tapeWrapper} pointerEvents="none">
        <WashiTape
          color={album.tapeColor}
          stripeColor={album.tapeStripe}
          width={90}
          height={18}
          rotate={isEven ? -4 : 4}
        />
      </View>

      {/* Album cover */}
      <LinearGradient
        colors={[album.color, album.color + 'CC']}
        style={styles.albumCover}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Binder rings */}
        <View style={styles.rings}>
          {[0, 1, 2].map(r => (
            <View key={r} style={styles.ring} />
          ))}
        </View>

        {/* Large emoji-style accent */}
        <View style={styles.albumEmoji}>
          <Sticker size={52} />
        </View>

        {/* Serial number */}
        <Text style={styles.albumSerial}>NO.{String(album.id).padStart(3, '0')}</Text>
      </LinearGradient>

      {/* Sticker decoration */}
      <View style={[styles.stickerDec, { transform: [{ rotate: isEven ? '-14deg' : '14deg' }] }]} pointerEvents="none">
        <Sticker size={30} />
      </View>

      <Text style={styles.albumTitle}>{album.title}</Text>
      <Text style={styles.albumSub}>{album.sub}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Kuaci.paper1,
  },
  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  brandName: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 32,
    color: Kuaci.ink1,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 10,
    color: Kuaci.ink3,
    letterSpacing: 0.1,
    marginTop: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
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
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 24,
    color: Kuaci.ink1,
    lineHeight: 28,
  },
  sectionSub: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 10,
    color: Kuaci.ink3,
    letterSpacing: 0.06,
    marginTop: 3,
  },
  seeAll: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 11,
    color: Kuaci.pink,
    letterSpacing: 0.04,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  albumCard: {
    width: '46%',
    backgroundColor: Kuaci.paper2,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Kuaci.paper3,
    padding: 10,
    position: 'relative',
    shadowColor: Kuaci.ink2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  tapeWrapper: {
    position: 'absolute',
    top: -9,
    left: '15%',
    zIndex: 5,
  },
  albumCover: {
    aspectRatio: 4 / 5,
    borderRadius: 8,
    marginBottom: 10,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(75,40,30,0.18)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rings: {
    position: 'absolute',
    left: 6,
    top: 14,
    bottom: 14,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  ring: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: Kuaci.paper1,
    borderWidth: 1,
    borderColor: 'rgba(75,40,30,0.3)',
  },
  albumEmoji: {
    opacity: 0.7,
  },
  albumSerial: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 8,
    color: 'rgba(75,40,30,0.5)',
    letterSpacing: 0.1,
  },
  stickerDec: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 6,
  },
  albumTitle: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 15,
    color: Kuaci.ink1,
  },
  albumSub: {
    fontFamily: 'SpecialElite_400Regular',
    fontSize: 10,
    color: Kuaci.ink3,
    marginTop: 2,
    letterSpacing: 0.06,
    textTransform: 'uppercase',
  },
  fab: {
    position: 'absolute',
    left: '50%',
    marginLeft: -30,
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: Kuaci.paper2,
    borderWidth: 2,
    borderColor: Kuaci.ink1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Kuaci.ink1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 4,
  },
});
