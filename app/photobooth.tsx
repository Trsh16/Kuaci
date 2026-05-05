import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PocaIcon } from '@/components/kuaci/PocaIcon';
import { Kuaci } from '@/constants/theme';

const FILTERS = ['none', 'film', 'sepia', 'warm', 'cool', 'b&w'] as const;
type Filter = (typeof FILTERS)[number];

export default function PhotoboothScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [permission, requestPermission] = useCameraPermissions();
  const [filter, setFilter] = useState<Filter>('film');
  const [mode, setMode] = useState<'single' | 'strip'>('single');
  const [facing, setFacing] = useState<CameraType>('front');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [capturing, setCapturing] = useState(false);
  const [stripUris, setStripUris] = useState<string[]>([]);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted && !permission.canAskAgain) {
      Alert.alert('Camera access needed', 'Enable camera in Settings to use the photobooth.');
    }
  }, [permission]);

  const toggleFacing = () => setFacing(f => f === 'front' ? 'back' : 'front');
  const toggleFlash = () => setFlash(f => f === 'off' ? 'on' : 'off');

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      allowsEditing: true,
      aspect: mode === 'single' ? [3, 4] : [5, 4],
    });
    if (!result.canceled && result.assets[0]) {
      router.push({ pathname: '/editor', params: { uri: result.assets[0].uri, filter } });
    }
  };

  const capturePhoto = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9, skipProcessing: false });
      if (!photo) return;

      if (mode === 'single') {
        router.push({ pathname: '/editor', params: { uri: photo.uri, filter } });
      } else {
        // Strip mode: collect up to 4 shots
        const next = [...stripUris, photo.uri];
        setStripUris(next);
        if (next.length >= 4) {
          router.push({ pathname: '/editor', params: { uris: next.join(','), filter, mode: 'strip' } });
          setStripUris([]);
        }
      }
    } finally {
      setCapturing(false);
    }
  };

  // Permission not yet determined
  if (!permission) {
    return <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator color="#FAF1E1" /></View>;
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <View style={[styles.root, styles.permCenter, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" />
        <TouchableOpacity style={styles.darkBtn} onPress={() => router.back()}>
          <PocaIcon name="close" size={20} color="#FAF1E1" />
        </TouchableOpacity>
        <Text style={styles.permText}>camera access needed ♡</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>allow camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.permBtn, { backgroundColor: 'transparent', borderColor: '#FAF1E1' }]} onPress={openGallery}>
          <Text style={[styles.permBtnText, { color: '#FAF1E1' }]}>pick from gallery instead</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const stripRemaining = mode === 'strip' ? 4 - stripUris.length : 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.darkBtn} onPress={() => router.back()}>
          <PocaIcon name="close" size={20} color="#FAF1E1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'strip' && stripUris.length > 0
            ? `${stripUris.length} / 4 snapped`
            : 'PHOTOBOOTH'}
        </Text>
        <TouchableOpacity style={styles.darkBtn} onPress={toggleFlash}>
          <PocaIcon name="flash" size={20} color={flash === 'on' ? Kuaci.butter : '#FAF1E1'} />
        </TouchableOpacity>
      </View>

      {/* Mode toggle */}
      <View style={styles.modeRow}>
        <View style={styles.modeToggle}>
          {(['single', 'strip'] as const).map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
              onPress={() => { setMode(m); setStripUris([]); }}
            >
              <Text style={[styles.modeBtnText, mode === m && styles.modeBtnTextActive]}>
                {m === 'single' ? 'SINGLE' : '4-UP STRIP'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Camera viewfinder */}
      <View style={mode === 'single' ? styles.singleWrapper : styles.stripCameraWrapper}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing={facing}
          flash={flash}
        />

        {/* Corner brackets */}
        {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h], i) => (
          <View key={i} style={[styles.bracket,
            v === 'top' ? { top: 14 } : { bottom: 14 },
            h === 'left' ? { left: 14 } : { right: 14 },
            {
              borderTopWidth: v === 'top' ? 2 : 0, borderBottomWidth: v === 'bottom' ? 2 : 0,
              borderLeftWidth: h === 'left' ? 2 : 0, borderRightWidth: h === 'right' ? 2 : 0,
            },
          ]} />
        ))}

        {/* Strip shot counter */}
        {mode === 'strip' && (
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {stripUris.length > 0 ? `${stripRemaining} more` : '4-UP STRIP'}
            </Text>
          </View>
        )}

        {capturing && (
          <View style={styles.flashOverlay} />
        )}
      </View>

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
      <View style={[styles.shutterRow, { paddingBottom: insets.bottom + 16 }]}>
        {/* Gallery picker */}
        <TouchableOpacity style={styles.shutterSide} onPress={openGallery}>
          <PocaIcon name="photo" size={22} color="#FAF1E1" />
        </TouchableOpacity>

        {/* Shutter */}
        <TouchableOpacity
          style={[styles.shutterBtn, capturing && { opacity: 0.7 }]}
          onPress={capturePhoto}
          activeOpacity={0.85}
          disabled={capturing}
        >
          <View style={styles.shutterInner} />
        </TouchableOpacity>

        {/* Flip camera */}
        <TouchableOpacity style={styles.shutterSide} onPress={toggleFacing}>
          <PocaIcon name="flip" size={22} color="#FAF1E1" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A1008' },
  permCenter: { alignItems: 'center', justifyContent: 'center', gap: 16 },
  permText: {
    fontFamily: 'Caveat_400Regular', fontSize: 24,
    color: '#FAF1E1', textAlign: 'center',
  },
  permBtn: {
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 6,
    backgroundColor: Kuaci.pink, borderWidth: 1.5, borderColor: '#FAF1E1',
  },
  permBtnText: {
    fontFamily: 'SpecialElite_400Regular', fontSize: 13,
    color: '#FAF1E1', letterSpacing: 0.1,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 14,
  },
  darkBtn: {
    width: 36, height: 36, borderRadius: 999,
    backgroundColor: 'rgba(250,241,225,0.14)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'SpecialElite_400Regular', fontSize: 14,
    color: '#FAF1E1', letterSpacing: 0.12,
  },
  modeRow: { alignItems: 'center', marginBottom: 12 },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(250,241,225,0.12)',
    borderRadius: 999, padding: 3,
  },
  modeBtn: { paddingHorizontal: 18, paddingVertical: 7, borderRadius: 999 },
  modeBtnActive: { backgroundColor: '#FAF1E1' },
  modeBtnText: {
    fontFamily: 'SpecialElite_400Regular', fontSize: 11,
    color: 'rgba(250,241,225,0.75)', letterSpacing: 0.08,
  },
  modeBtnTextActive: { color: '#1A1008' },

  // Single mode: fill remaining height
  singleWrapper: {
    marginHorizontal: 18, flex: 1, marginBottom: 8,
    borderRadius: 6, borderWidth: 6, borderColor: '#FAF1E1',
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  // Strip mode: fixed 3:4 box centred
  stripCameraWrapper: {
    marginHorizontal: 18, marginBottom: 8,
    height: 240, borderRadius: 6,
    borderWidth: 6, borderColor: '#FAF1E1',
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },

  bracket: {
    position: 'absolute', width: 18, height: 18, borderColor: '#FAF1E1',
  },
  counterBadge: {
    position: 'absolute', top: 10, left: 10,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4,
    backgroundColor: 'rgba(30,15,5,0.65)',
  },
  counterText: {
    fontFamily: 'SpecialElite_400Regular', fontSize: 10,
    color: '#FAF1E1', letterSpacing: 0.1,
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  filterSection: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 8 },
  filterLabel: {
    fontFamily: 'SpecialElite_400Regular', fontSize: 9,
    color: 'rgba(250,241,225,0.55)', letterSpacing: 0.12, marginBottom: 8,
  },
  filterRow: { gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 4,
    backgroundColor: 'rgba(250,241,225,0.12)',
  },
  filterChipActive: { backgroundColor: '#FAF1E1' },
  filterChipText: {
    fontFamily: 'SpecialElite_400Regular', fontSize: 11,
    color: 'rgba(250,241,225,0.85)', letterSpacing: 0.08,
  },
  filterChipTextActive: { color: '#1A1008' },

  shutterRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-around', paddingHorizontal: 36, paddingTop: 8,
  },
  shutterSide: {
    width: 48, height: 48, borderRadius: 999,
    backgroundColor: 'rgba(250,241,225,0.14)',
    alignItems: 'center', justifyContent: 'center',
  },
  shutterBtn: {
    width: 78, height: 78, borderRadius: 999,
    backgroundColor: '#FAF1E1', borderWidth: 4, borderColor: Kuaci.pink,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Kuaci.pink, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45, shadowRadius: 12, elevation: 8,
  },
  shutterInner: { width: 56, height: 56, borderRadius: 999, backgroundColor: Kuaci.pink },
});
