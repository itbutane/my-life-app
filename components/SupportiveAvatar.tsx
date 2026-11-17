import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SUPPORTIVE_AVATARS } from '../constants/data';
import { SupportiveAvatar as SupportiveAvatarType } from '../types';
import { useTheme } from '../hooks/useTheme';

interface SupportiveAvatarProps {
  avatar: SupportiveAvatarType;
  size?: 'small' | 'medium' | 'large';
  showMessage?: boolean;
  message?: string;
  onPress?: () => void;
  animate?: boolean;
}

export const SupportiveAvatar: React.FC<SupportiveAvatarProps> = ({
  avatar,
  size = 'medium',
  showMessage = false,
  message,
  onPress,
  animate = true,
}) => {
  const { themeColors, isDark } = useTheme();
  const [breathAnim] = useState(() => new Animated.Value(0));
  const [floatAnim] = useState(() => new Animated.Value(0));
  const [showBubble, setShowBubble] = useState(false);

  const sizeStyles = {
    small: { avatar: 60, font: 28, bubbleWidth: 200 },
    medium: { avatar: 100, font: 48, bubbleWidth: 280 },
    large: { avatar: 160, font: 80, bubbleWidth: 320 },
  };

  const s = sizeStyles[size];

  useEffect(() => {
    if (!animate) {
      breathAnim.stopAnimation();
      floatAnim.stopAnimation();
      breathAnim.setValue(0);
      floatAnim.setValue(0);
      return;
    }
    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(breathAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    breathLoop.start();
    floatLoop.start();
    return () => {
      breathLoop.stop();
      floatLoop.stop();
    };
  }, [animate, breathAnim, floatAnim]);

  useEffect(() => {
    if (message) {
      setShowBubble(true);
      const timer = setTimeout(() => setShowBubble(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const scale = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.05],
  });

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-5, 5],
  });

  const opacity = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.avatarWrapper,
          { width: s.avatar, height: s.avatar },
          { transform: [{ scale }, { translateY }] },
        ]}
      >
        <LinearGradient
          colors={avatar.gradient}
          style={[
            styles.gradientBg,
            { width: s.avatar, height: s.avatar, borderRadius: s.avatar / 2 },
          ]}
        >
          <Text style={[styles.avatarEmoji, { fontSize: s.font }]}>{avatar.emoji}</Text>
        </LinearGradient>

        <Animated.View
          style={[
            styles.glow,
            { width: s.avatar + 20, height: s.avatar + 20 },
            { opacity },
          ]}
        />
      </Animated.View>

      {showMessage && showBubble && message && (
        <Animated.View
          style={[
            styles.messageBubble,
            { width: s.bubbleWidth, backgroundColor: isDark ? themeColors.surface : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,107,157,0.2)' },
          ]}
        >
          <Text style={[styles.messageText, { color: themeColors.text }]}>{message}</Text>
          <View style={[styles.bubbleTail, { borderTopColor: isDark ? themeColors.surface : '#fff' }]} />
        </Animated.View>
      )}

      {!showMessage && (
        <View style={styles.nameLabel}>
          <Text style={[styles.nameText, { color: themeColors.textSecondary }]}>{avatar.name}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const AvatarSelector: React.FC<{
  selectedAvatar: SupportiveAvatarType;
  onSelect: (avatar: SupportiveAvatarType) => void;
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
}> = ({ selectedAvatar, onSelect, size = 'medium', animate = true }) => {
  return (
    <View style={styles.selectorContainer}>
      {SUPPORTIVE_AVATARS.map(avatar => (
        <SupportiveAvatar
          key={avatar.id}
          avatar={avatar as SupportiveAvatarType}
          size={size}
          animate={animate}
          onPress={() => onSelect(avatar as SupportiveAvatarType)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBg: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarEmoji: {
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,107,157,0.3)',
  },
  messageBubble: {
    position: 'absolute',
    bottom: -60,
    left: '50%',
    transform: [{ translateX: -140 }],
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,107,157,0.2)',
  },
  messageText: {
    fontSize: 13,
    color: '#2D3436',
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: [{ translateX: -4 }],
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
  },
  nameLabel: {
    marginTop: 8,
  },
  nameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636E72',
  },
  selectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 8,
  },
});

export default SupportiveAvatar;