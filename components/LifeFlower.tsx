import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { LifeFlowerState } from '../types';
import { MOTIVATIONAL_QUOTES } from '../constants/data';

interface LifeFlowerProps {
  state: LifeFlowerState;
  onBloom: (message: string) => boolean | void;
  size?: number;
  animated?: boolean;
}

export const LifeFlower: React.FC<LifeFlowerProps> = ({
  state,
  onBloom,
  size = 280,
  animated = true,
}) => {
  const { themeColors, isDark } = useTheme();
  const [rotateAnim] = React.useState(() => new Animated.Value(0));
  const [pulseAnim] = React.useState(() => new Animated.Value(0));
  const [bloomAnim] = React.useState(() => new Animated.Value(state.petals));
  const [quote, setQuote] = React.useState('');

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 30000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    Animated.timing(bloomAnim, {
      toValue: state.petals,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [animated, state.petals, rotateAnim, pulseAnim, bloomAnim]);

  useEffect(() => {
    if (state.messages.length > 0) {
      const lastMsg = state.messages[state.messages.length - 1];
      setQuote(lastMsg);
      const timer = setTimeout(() => setQuote(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [state.messages]);

  const petalColors = [
    '#FF6B9D', '#FFB3C6', '#A29BFE', '#74B9FF',
    '#55EFC4', '#A8D8EA', '#FFEAA7', '#FD9644',
    '#FF6B9D', '#FFB3C6', '#A29BFE', '#74B9FF',
  ];

  const centerScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  const bloomProgress = bloomAnim.interpolate({
    inputRange: [0, 12],
    outputRange: [0, 1],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.flowerWrapper,
          { width: size, height: size },
          { transform: [{ rotate: rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] },
        ]}
      >
        {/* Petals */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const radius = size * 0.38;
          const x = Math.sin(angle) * radius;
          const y = -Math.cos(angle) * radius;
          
          const petalOpacity = bloomAnim.interpolate({
            inputRange: [i, i + 0.8],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          });
          
          const petalScale = bloomAnim.interpolate({
            inputRange: [i, i + 0.8],
            outputRange: [0.3, 1],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.petal,
                {
                  left: size / 2 + x - 28,
                  top: size / 2 + y - 28,
                  backgroundColor: petalColors[i],
                  opacity: petalOpacity,
                  transform: [{ scale: petalScale }, { rotate: `${i * 30}deg` }],
                },
              ]}
            >
              <View style={styles.petalInner} />
            </Animated.View>
          );
        })}

        {/* Center */}
        <Animated.View
          style={[
            styles.center,
            { width: size * 0.35, height: size * 0.35 },
            { transform: [{ scale: centerScale }] },
          ]}
        >
          <View style={styles.centerGlow} />
          <View style={styles.centerCore}>
            <Text style={styles.petalCount}>{state.petals}/{state.maxPetals}</Text>
            <Text style={styles.centerLabel}>گل زندگی</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {quote && (
        <Animated.View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>✨ {quote} ✨</Text>
        </Animated.View>
      )}

      <TouchableOpacity 
        style={[styles.bloomButton, { backgroundColor: state.petals >= state.maxPetals ? themeColors.textMuted : themeColors.primary, opacity: state.petals >= state.maxPetals ? 0.85 : 1 }]}
        onPress={() => {
          if (state.petals >= state.maxPetals) return;
          onBloom(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
        }}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={state.petals >= state.maxPetals ? 'گل زندگی کامل شده است' : 'شکوفا کردن گلبرگ جدید'}
      >
        <Text style={styles.bloomButtonText}>
          {state.petals >= state.maxPetals ? '🌸 گل پر شکوفا شد!' : '🌱 شکوفا کردن گلبرگ جدید (+۲۵ XP)'}
        </Text>
      </TouchableOpacity>
      {state.lastBloom ? (
        <Text style={{ marginTop: 6, fontSize: 11, color: themeColors.textSecondary }}>آخرین شکوفایی: {new Date(state.lastBloom).toLocaleDateString('fa-IR')}</Text>
      ) : null}

      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            { width: `${(state.petals / state.maxPetals) * 100}%` },
            { backgroundColor: themeColors.primary },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  flowerWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petal: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  petalInner: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  center: {
    position: 'absolute',
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  centerGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,107,157,0.3)',
  },
  centerCore: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  petalCount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  centerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  quoteContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,107,157,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,157,0.3)',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#FF6B9D',
    fontWeight: '500',
  },
  bloomButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bloomButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  progressBar: {
    marginTop: 16,
    width: '100%',
    maxWidth: 280,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default LifeFlower;