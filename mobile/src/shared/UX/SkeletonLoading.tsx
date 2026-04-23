import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ScrollView } from 'react-native';

const SkeletonBase = ({ style = {} }: { style?: any }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View 
      style={[
        styles.base, 
        style, 
        { opacity }
      ]} 
    />
  );
};

export const SkeletonLoader = ({ type, count = 1 }: { type: 'card' | 'profile' | 'details', count?: number }) => {
  const layouts = {
    card: (
      <View style={styles.card}>
        <SkeletonBase style={styles.cardImage} />
        <SkeletonBase style={[styles.line, { width: '50%' }]} />
        <SkeletonBase style={[styles.line, { width: '50%', alignSelf: 'flex-end' }]} />
        <SkeletonBase style={[styles.line, { width: '40%' }]} />
        <View style={styles.footer}>
          <SkeletonBase style={styles.smallBtn} />
          <SkeletonBase style={styles.pillBtn} />
        </View>
      </View>
    ),
    profile: (
      <View style={styles.profileRow}>
        <SkeletonBase style={styles.avatar} />
        <View style={styles.profileText}>
          <SkeletonBase style={styles.titleLine} />
          <SkeletonBase style={styles.subTitleLine} />
        </View>
      </View>
    ),
    details: (
      <View style={styles.detailsContainer}>
        <SkeletonBase style={styles.detailsImage} />
        <SkeletonBase style={styles.titleLine} />
        <View style={styles.grid}>
          <SkeletonBase style={styles.gridItem} />
          <SkeletonBase style={styles.gridItem} />
        </View>
      </View>
    )
  };

  return (
    <View style={{ width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ marginBottom: 20 }}>
          {layouts[type]}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#334155',
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  cardImage: {
    height: 200,
    width: '100%',
    marginBottom: 16,
  },
  line: {
    height: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  smallBtn: { width: 60, height: 30 },
  pillBtn: { width: 100, height: 30, borderRadius: 20 },
  
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileText: {
    marginLeft: 16,
    flex: 1,
  },
  titleLine: { height: 24, width: '70%', marginBottom: 8 },
  subTitleLine: { height: 16, width: '40%' },

  detailsContainer: { padding: 16 },
  detailsImage: { height: 250, width: '100%', marginBottom: 20 },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  gridItem: { height: 80, width: '48%' }
});