import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { FamilyMember } from '../types';

interface UnicornAvatarProps {
  member: FamilyMember;
  size?: number;
  onPress?: () => void;
  animated?: boolean;
  showQuote?: boolean;
  isSelected?: boolean;
}

export const UnicornAvatar: React.FC<UnicornAvatarProps> = ({
  member,
  size = 120,
  onPress,
  animated = true,
  showQuote = true,
  isSelected = false,
}) => {
  const { themeColors, isDark } = useTheme();
  const [bounceAnim] = React.useState(() => new Animated.Value(0));
  const [glowAnim] = React.useState(() => new Animated.Value(0));

  React.useEffect(() => {
    if (!animated) {
      bounceAnim.stopAnimation();
      glowAnim.stopAnimation();
      bounceAnim.setValue(0);
      glowAnim.setValue(0);
      return;
    }
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    bounceLoop.start();
    glowLoop.start();
    return () => {
      bounceLoop.stop();
      glowLoop.stop();
    };
  }, [animated, bounceAnim, glowAnim]);

  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const scale = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const gradientColors = member.gradient || (isDark ? ['#A29BFE', '#FF6B9D'] : ['#FF6B9D', '#A29BFE']);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.container}>
      <Animated.View
        style={[
          styles.avatarWrapper,
          { width: size, height: size },
          { transform: [{ translateY }, { scale }] },
        ]}
      >
        <View
          style={[
            styles.gradientBorder,
            { width: size + 8, height: size + 8 },
            { borderRadius: (size + 8) / 2 },
          ]}
        >
          <View style={styles.glowContainer}>
            <Animated.View
              style={[
                styles.glowRing,
                { width: size + 20, height: size + 20 },
                { opacity: glowOpacity },
                { borderColor: gradientColors[0] },
              ]}
            />
          </View>
          
          <View style={[
            styles.avatarContainer,
            { width: size, height: size },
            { borderRadius: size / 2 },
            { backgroundColor: isDark ? themeColors.surface : themeColors.surfaceVariant },
          ]}>
            {member.photoUri ? (
              <Image source={{ uri: member.photoUri }} style={{ width: size, height: size, borderRadius: size / 2 }} resizeMode="cover" />
            ) : (
              <Text style={[styles.avatarEmoji, { fontSize: size * 0.5 }]}>
                {member.avatarEmoji || (member.id === 'baba' ? '👨‍🦱' : member.id === 'maman' ? '👩‍🦰' : '🌸')}
              </Text>
            )}
            
            {isSelected && (
              <View style={styles.selectedRing} />
            )}
          </View>
        </View>
      </Animated.View>

      <View style={styles.infoContainer}>
        <Text style={[
          styles.name,
          { color: themeColors.text },
          { fontSize: size * 0.16 },
        ]}>
          {member.name}
        </Text>
        {showQuote && member.quote && (
          <Text style={[
            styles.quote,
            { color: themeColors.textSecondary },
            { fontSize: size * 0.11 },
          ]}>
            "{member.quote}"
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBorder: {
    position: 'absolute',
    top: -4,
    left: -4,
    borderRadius: 9999,
    padding: 2,
    backgroundColor: 'transparent',
  },
  glowContainer: {
    position: 'absolute',
    top: -10,
    left: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  avatarContainer: {
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  selectedRing: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 9999,
    borderWidth: 3,
    borderColor: '#FFD93D',
  },
  avatarEmoji: {
    textAlign: 'center',
  },
  infoContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  name: {
    fontWeight: '700',
    textAlign: 'center',
  },
  quote: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 8,
    lineHeight: 20,
  },
});

export default UnicornAvatar;