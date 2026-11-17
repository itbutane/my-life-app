import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Memory } from '../types';

interface MemoryCardProps {
  memory: Memory;
  onPress?: () => void;
  onLongPress?: () => void;
  animated?: boolean;
}

const TYPE_CONFIG = {
  memory: { emoji: '📸', label: 'خاطره', color: '#FF6B9D', gradient: ['#FF6B9D', '#FFB3C6'] },
  wish: { emoji: '⭐', label: 'آرزو', color: '#A29BFE', gradient: ['#A29BFE', '#74B9FF'] },
  love: { emoji: '💕', label: 'پیام عاشقانه', color: '#FD9644', gradient: ['#FD9644', '#FFEAA7'] },
  legacy: { emoji: '🏛️', label: 'یادگاری', color: '#4ECDC4', gradient: ['#4ECDC4', '#55EFC4'] },
};

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onPress,
  onLongPress,
  animated = true,
}) => {
  const { themeColors, isDark } = useTheme();
  const [pressAnim] = React.useState(() => new Animated.Value(0));
  const [entranceAnim] = React.useState(() => new Animated.Value(0));
  const config = TYPE_CONFIG[memory.type];

  React.useEffect(() => {
    if (!animated) {
      entranceAnim.setValue(1);
      return;
    }
    entranceAnim.setValue(0);
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [animated, entranceAnim]);

  const scale = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.96],
  });

  const opacity = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const handlePressIn = () => Animated.timing(pressAnim, { toValue: 1, duration: 100, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.timing(pressAnim, { toValue: 0, duration: 100, useNativeDriver: true }).start();

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, transform: [{ scale }, { translateY }] },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.touchable}
      >
        <View style={[styles.card, { borderColor: config.color }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[
              styles.typeBadge,
              { backgroundColor: config.color },
            ]}>
              <Text style={styles.typeEmoji}>{config.emoji}</Text>
              <Text style={styles.typeLabel}>{config.label}</Text>
            </View>
            <View style={styles.authorInfo}>
              <View style={[
                styles.authorAvatar,
                { backgroundColor: config.gradient[0] },
              ]}>
                <Text style={styles.authorInitial}>
                  {memory.author === 'baba' ? '👨' : memory.author === 'maman' ? '👩' : '🌸'}
                </Text>
              </View>
              <Text style={[styles.authorName, { color: themeColors.text }]}>
                {memory.author === 'baba' ? 'بابا' : memory.author === 'maman' ? 'مامان' : 'دختر'}
              </Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {memory.imageUri && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: memory.imageUri }} style={styles.memoryImage} resizeMode="cover" />
              </View>
            )}
            <Text style={[styles.memoryText, { color: themeColors.text }]} numberOfLines={4}>
              {memory.content}
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.date, { color: themeColors.textMuted }]}>
              {new Date(memory.date).toLocaleString('fa-IR')}
            </Text>
            <View style={styles.stickers}>
              {memory.stickers.map((sticker, i) => (
                <Text key={i} style={styles.sticker}>{sticker}</Text>
              ))}
            </View>
          </View>

          {memory.isLocked && (
            <View style={styles.lockOverlay}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  touchable: {
    overflow: 'hidden',
  },
  card: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  authorInitial: {
    fontSize: 16,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    height: 200,
  },
  memoryImage: {
    width: '100%',
    height: '100%',
  },
  memoryText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  date: {
    fontSize: 11,
    fontWeight: '500',
  },
  stickers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sticker: {
    fontSize: 16,
    marginLeft: 4,
  },
  lockOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 16,
  },
});

export default MemoryCard;