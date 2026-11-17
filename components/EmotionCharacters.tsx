import React from 'react';
import { View, Text, StyleSheet, Animated, Easing, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Circle, Ellipse, Rect, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type CharacterId = 'joy'|'sadness'|'anger'|'fear'|'disgust'|'anxiety'|'envy'|'ennui'|'embarrassment'|'nostalgia'|'paula'|'xeni'|'jean';

export const SEASONS: { id: Season; label: string; emoji: string; decor: string }[] = [
  { id: 'spring', label: 'بهاری', emoji: '🌸', decor: '#FFB3C6' },
  { id: 'summer', label: 'تابستانی', emoji: '☀️', decor: '#FFD93D' },
  { id: 'autumn', label: 'پاییزی', emoji: '🍂', decor: '#FB923C' },
  { id: 'winter', label: 'زمستانی', emoji: '❄️', decor: '#93C5FD' },
];

export const CHARACTERS: { id: CharacterId; name: string; fa: string; source: string; color: string; accent: string }[] = [
  { id: 'joy', name: 'Joy', fa: 'جوی (شادی)', source: 'Inside Out', color: '#FFD93D', accent: '#74B9FF' },
  { id: 'sadness', name: 'Sadness', fa: 'سدنِس (غم)', source: 'Inside Out', color: '#74B9FF', accent: '#6C5CE7' },
  { id: 'anger', name: 'Anger', fa: 'خشم', source: 'Inside Out', color: '#FF6B6B', accent: '#FFB703' },
  { id: 'fear', name: 'Fear', fa: 'ترس', source: 'Inside Out', color: '#A29BFE', accent: '#DFE6E9' },
  { id: 'disgust', name: 'Disgust', fa: 'انزجار', source: 'Inside Out', color: '#55EFC4', accent: '#00B894' },
  { id: 'anxiety', name: 'Anxiety', fa: 'اضطراب', source: 'Inside Out 2', color: '#FD9644', accent: '#A29BFE' },
  { id: 'envy', name: 'Envy', fa: 'حسادت', source: 'Inside Out 2', color: '#00CEC9', accent: '#81ECEC' },
  { id: 'ennui', name: 'Ennui', fa: 'ملال', source: 'Inside Out 2', color: '#636E72', accent: '#B2BEC3' },
  { id: 'embarrassment', name: 'Embarrassment', fa: 'خجالت', source: 'Inside Out 2', color: '#FAB1A0', accent: '#FF7675' },
  { id: 'nostalgia', name: 'Nostalgia', fa: 'نوستالژی', source: 'Inside Out 2', color: '#D6A2E8', accent: '#F3E8FF' },
  { id: 'paula', name: 'Paula', fa: 'پائولا (کارگردان رویا)', source: 'Dream Productions', color: '#A29BFE', accent: '#FFD93D' },
  { id: 'xeni', name: 'Xeni', fa: 'زِنی (خلاق رویا)', source: 'Dream Productions', color: '#FF9FF3', accent: '#74B9FF' },
  { id: 'jean', name: 'Jean', fa: 'ژان (مدیر استودیو)', source: 'Dream Productions', color: '#81ECEC', accent: '#636E72' },
];

const SeasonDecor: React.FC<{ season: Season; size: number }> = ({ season, size }) => {
  if (season === 'spring') {
    return <G>
      <Circle cx={size*0.18} cy={size*0.18} r={size*0.07} fill="#FFB3C6" opacity={0.9} />
      <Circle cx={size*0.82} cy={size*0.2} r={size*0.06} fill="#FF9FF3" opacity={0.8} />
      <Path d={`M ${size*0.1} ${size*0.85} q ${size*0.06} -${size*0.08} ${size*0.12} 0`} stroke="#55EFC4" strokeWidth={3} fill="none" />
      <Circle cx={size*0.16} cy={size*0.8} r={size*0.035} fill="#FF6B9D" />
    </G>;
  }
  if (season === 'summer') {
    return <G>
      <Circle cx={size*0.82} cy={size*0.18} r={size*0.09} fill="#FFD93D" />
      {[0,45,90,135,180,225,270,315].map(a => <Rect key={a} x={size*0.81} y={size*0.04} width={size*0.02} height={size*0.06} fill="#FFB703" rotation={a} origin={`${size*0.82},${size*0.18}`} />)}
      <Ellipse cx={size*0.18} cy={size*0.86} rx={size*0.08} ry={size*0.05} fill="#2EC4B6" opacity={0.7} />
    </G>;
  }
  if (season === 'autumn') {
    return <G>
      <Path d={`M ${size*0.15} ${size*0.2} q ${size*0.05} -${size*0.08} ${size*0.1} 0 q -${size*0.05} ${size*0.08} -${size*0.1} 0`} fill="#FB923C" />
      <Path d={`M ${size*0.78} ${size*0.78} q ${size*0.06} -${size*0.1} ${size*0.12} 0 q -${size*0.06} ${size*0.1} -${size*0.12} 0`} fill="#D97706" />
      <Circle cx={size*0.82} cy={size*0.22} r={size*0.04} fill="#DC2626" opacity={0.8} />
    </G>;
  }
  return <G>
    <Circle cx={size*0.18} cy={size*0.18} r={size*0.025} fill="#E0F2FE" /><Circle cx={size*0.8} cy={size*0.22} r={size*0.02} fill="#BAE6FD" />
    <Circle cx={size*0.22} cy={size*0.78} r={size*0.03} fill="#E0F2FE" /><Circle cx={size*0.82} cy={size*0.8} r={size*0.025} fill="#BFDBFE" />
    <Path d={`M ${size*0.15} ${size*0.12} l 0 ${size*0.06} M ${size*0.12} ${size*0.15} l ${size*0.06} 0`} stroke="#93C5FD" strokeWidth={1.5} />
  </G>;
};

const CharacterFace: React.FC<{ id: CharacterId; size: number; season: Season }> = ({ id, size, season }) => {
  const c = CHARACTERS.find(x => x.id === id)!;
  const cx = size/2, cy = size/2 + size*0.03, r = size*0.28;
  const eyeY = cy - r*0.15, eyeDx = r*0.38, eyeR = r*0.16;
  const mouthY = cy + r*0.28;
  const commonEyes = (pupilY=0, scaleY=1) => (
    <G>
      <Ellipse cx={cx-eyeDx} cy={eyeY} rx={eyeR} ry={eyeR*scaleY} fill="#fff" />
      <Ellipse cx={cx+eyeDx} cy={eyeY} rx={eyeR} ry={eyeR*scaleY} fill="#fff" />
      <Circle cx={cx-eyeDx} cy={eyeY+pupilY} r={eyeR*0.45} fill="#2D3436" />
      <Circle cx={cx+eyeDx} cy={eyeY+pupilY} r={eyeR*0.45} fill="#2D3436" />
    </G>
  );
  const blush = <G><Circle cx={cx-r*0.55} cy={cy+r*0.05} r={r*0.18} fill="#FF7675" opacity={0.25} /><Circle cx={cx+r*0.55} cy={cy+r*0.05} r={r*0.18} fill="#FF7675" opacity={0.25} /></G>;

  const body = () => {
    switch(id){
      case 'joy': return <G>
        <Circle cx={cx} cy={cy} r={r} fill={c.color} />
        <Path d={`M ${cx-r*0.9} ${cy-r*0.2} q ${r*0.4} -${r*0.9} ${r*0.9} -${r*0.5}`} stroke="#74B9FF" strokeWidth={4} fill="none" />
        <Path d={`M ${cx+r*0.9} ${cy-r*0.2} q -${r*0.4} -${r*0.9} -${r*0.9} -${r*0.5}`} stroke="#74B9FF" strokeWidth={4} fill="none" />
        {commonEyes(-1)}
        <Path d={`M ${cx-r*0.35} ${mouthY} q ${r*0.35} ${r*0.35} ${r*0.7} 0`} stroke="#2D3436" strokeWidth={3} fill="none" strokeLinecap="round" />
        {blush}
      </G>;
      case 'sadness': return <G>
        <Circle cx={cx} cy={cy} r={r} fill={c.color} />
        <Ellipse cx={cx-eyeDx} cy={eyeY} rx={eyeR*1.15} ry={eyeR*1.2} fill="#fff" stroke="#4D96FF" strokeWidth={2} />
        <Ellipse cx={cx+eyeDx} cy={eyeY} rx={eyeR*1.15} ry={eyeR*1.2} fill="#fff" stroke="#4D96FF" strokeWidth={2} />
        <Circle cx={cx-eyeDx} cy={eyeY+2} r={eyeR*0.4} fill="#2D3436" /><Circle cx={cx+eyeDx} cy={eyeY+2} r={eyeR*0.4} fill="#2D3436" />
        <Path d={`M ${cx-r*0.25} ${mouthY+r*0.1} q ${r*0.25} -${r*0.2} ${r*0.5} 0`} stroke="#2D3436" strokeWidth={3} fill="none" strokeLinecap="round" />
        <Path d={`M ${cx-eyeDx} ${eyeY+eyeR*1.1} q 0 ${r*0.15} 0 ${r*0.25}`} stroke="#6C5CE7" strokeWidth={2} fill="none" />
      </G>;
      case 'anger': return <G>
        <Rect x={cx-r} y={cy-r} width={r*2} height={r*2} rx={r*0.25} fill={c.color} />
        <Path d={`M ${cx-r*0.1} ${cy-r*1.05} l ${r*0.2} -${r*0.25} l ${r*0.1} ${r*0.2} Z`} fill="#FFB703" />
        <Rect x={cx-eyeDx-eyeR} y={eyeY-eyeR*0.4} width={eyeR*2} height={eyeR*0.8} rx={2} fill="#fff" />
        <Rect x={cx+eyeDx-eyeR} y={eyeY-eyeR*0.4} width={eyeR*2} height={eyeR*0.8} rx={2} fill="#fff" />
        <Circle cx={cx-eyeDx} cy={eyeY} r={eyeR*0.35} fill="#2D3436" /><Circle cx={cx+eyeDx} cy={eyeY} r={eyeR*0.35} fill="#2D3436" />
        <Path d={`M ${cx-eyeDx-eyeR} ${eyeY-eyeR*0.9} l ${eyeR*2} ${eyeR*0.4}`} stroke="#2D3436" strokeWidth={3} />
        <Path d={`M ${cx+eyeDx+eyeR} ${eyeY-eyeR*0.9} l -${eyeR*2} ${eyeR*0.4}`} stroke="#2D3436" strokeWidth={3} />
        <Rect x={cx-r*0.3} y={mouthY-r*0.05} width={r*0.6} height={r*0.18} rx={2} fill="#fff" />
      </G>;
      case 'fear': return <G>
        <Ellipse cx={cx} cy={cy} rx={r*0.85} ry={r*1.05} fill={c.color} />
        <Path d={`M ${cx-r*0.5} ${cy-r*0.9} q -${r*0.3} -${r*0.4} 0 -${r*0.2}`} stroke={c.color} strokeWidth={6} fill="none" />
        {commonEyes(0,1.15)}
        <Ellipse cx={cx} cy={mouthY+r*0.05} rx={r*0.18} ry={r*0.22} fill="#2D3436" />
      </G>;
      case 'disgust': return <G>
        <Circle cx={cx} cy={cy} r={r} fill={c.color} />
        {commonEyes(0,0.9)}
        <Path d={`M ${cx-eyeDx-eyeR} ${eyeY-eyeR*0.8} q ${eyeR} ${eyeR*0.4} ${eyeR*2} 0`} stroke="#2D3436" strokeWidth={2.5} fill="none" />
        <Path d={`M ${cx-r*0.3} ${mouthY} q ${r*0.15} -${r*0.15} ${r*0.3} 0 q ${r*0.15} ${r*0.15} ${r*0.3} 0`} stroke="#2D3436" strokeWidth={3} fill="none" />
        <Path d={`M ${cx+r*0.1} ${cy-r*0.95} c ${r*0.3} -${r*0.2} ${r*0.5} ${r*0.1} ${r*0.2} ${r*0.3}`} fill="#00B894" />
      </G>;
      case 'anxiety': return <G>
        <Ellipse cx={cx} cy={cy} rx={r*0.9} ry={r*1.05} fill={c.color} />
        <Path d={`M ${cx-r*0.6} ${cy-r*0.7} q ${r*0.2} -${r*0.5} ${r*0.4} 0 q ${r*0.2} -${r*0.5} ${r*0.4} 0 q ${r*0.2} -${r*0.4} ${r*0.4} ${r*0.1}`} stroke="#7C2D12" strokeWidth={4} fill="none" />
        <Circle cx={cx-eyeDx} cy={eyeY} r={eyeR*1.1} fill="#fff" /><Circle cx={cx+eyeDx} cy={eyeY} r={eyeR*1.1} fill="#fff" />
        <Circle cx={cx-eyeDx+1} cy={eyeY} r={eyeR*0.4} fill="#2D3436" /><Circle cx={cx+eyeDx-1} cy={eyeY} r={eyeR*0.4} fill="#2D3436" />
        <Path d={`M ${cx-r*0.25} ${mouthY} q ${r*0.25} ${r*0.15} ${r*0.5} 0`} stroke="#2D3436" strokeWidth={3} fill="none" />
        <Path d={`M ${cx+r*0.7} ${cy+r*0.2} l ${r*0.25} ${r*0.5}`} stroke={c.color} strokeWidth={5} strokeLinecap="round" />
      </G>;
      case 'envy': return <G>
        <Circle cx={cx} cy={cy+r*0.05} r={r*0.92} fill={c.color} />
        {commonEyes(1,1.15)}
        <Circle cx={cx-eyeDx-r*0.05} cy={eyeY-r*0.25} r={r*0.08} fill="#fff" opacity={0.8} />
        <Path d={`M ${cx-r*0.2} ${mouthY} q ${r*0.2} ${r*0.2} ${r*0.4} 0`} stroke="#2D3436" strokeWidth={3} fill="none" />
        {blush}
      </G>;
      case 'ennui': return <G>
        <Ellipse cx={cx} cy={cy} rx={r} ry={r*0.95} fill={c.color} />
        <Rect x={cx-eyeDx-eyeR*1.1} y={eyeY-eyeR*0.3} width={eyeR*2.2} height={eyeR*0.5} rx={3} fill="#fff" />
        <Rect x={cx+eyeDx-eyeR*1.1} y={eyeY-eyeR*0.3} width={eyeR*2.2} height={eyeR*0.5} rx={3} fill="#fff" />
        <Circle cx={cx-eyeDx} cy={eyeY-r*0.02} r={eyeR*0.3} fill="#2D3436" /><Circle cx={cx+eyeDx} cy={eyeY-r*0.02} r={eyeR*0.3} fill="#2D3436" />
        <Path d={`M ${cx-r*0.25} ${mouthY} l ${r*0.5} 0`} stroke="#2D3436" strokeWidth={3} strokeLinecap="round" />
        <Path d={`M ${cx-r*0.2} ${cy-r*0.85} q ${r*0.2} -${r*0.25} ${r*0.4} 0`} stroke="#4B5563" strokeWidth={5} fill="none" />
      </G>;
      case 'embarrassment': return <G>
        <Circle cx={cx} cy={cy} r={r} fill={c.color} />
        {commonEyes(2,0.8)}
        <Path d={`M ${cx-r*0.2} ${mouthY+r*0.05} q ${r*0.2} ${r*0.1} ${r*0.4} 0`} stroke="#2D3436" strokeWidth={3} fill="none" />
        <Circle cx={cx-r*0.55} cy={cy+r*0.05} r={r*0.22} fill="#FF7675" opacity={0.35} />
        <Circle cx={cx+r*0.55} cy={cy+r*0.05} r={r*0.22} fill="#FF7675" opacity={0.35} />
        <Path d={`M ${cx-r*0.1} ${cy-r*0.95} q ${r*0.2} -${r*0.2} ${r*0.3} ${r*0.1}`} stroke="#9CA3AF" strokeWidth={4} fill="none" />
      </G>;
      case 'nostalgia': return <G>
        <Circle cx={cx} cy={cy} r={r} fill={c.color} />
        <Circle cx={cx-eyeDx} cy={eyeY} r={eyeR*1.05} fill="#fff" stroke="#C084FC" strokeWidth={2} />
        <Circle cx={cx+eyeDx} cy={eyeY} r={eyeR*1.05} fill="#fff" stroke="#C084FC" strokeWidth={2} />
        <Circle cx={cx-eyeDx} cy={eyeY} r={eyeR*0.35} fill="#6D28D9" /><Circle cx={cx+eyeDx} cy={eyeY} r={eyeR*0.35} fill="#6D28D9" />
        <Path d={`M ${cx-r*0.25} ${mouthY} q ${r*0.25} ${r*0.25} ${r*0.5} 0`} stroke="#6D28D9" strokeWidth={3} fill="none" />
        <Path d={`M ${cx-r*0.4} ${cy-r*0.75} q ${r*0.4} -${r*0.2} ${r*0.8} 0`} stroke="#F3E8FF" strokeWidth={5} fill="none" />
      </G>;
      case 'paula': return <G>
        <Circle cx={cx} cy={cy} r={r} fill={c.color} />
        <Rect x={cx-r*0.7} y={cy-r*0.15} width={r*1.4} height={r*0.35} rx={4} fill="#1F2937" opacity={0.15} />
        {commonEyes(0)}
        <Path d={`M ${cx-r*0.3} ${mouthY} q ${r*0.3} ${r*0.25} ${r*0.6} 0`} stroke="#2D3436" strokeWidth={3} fill="none" />
        <Path d={`M ${cx-r*0.8} ${cy-r*0.7} l ${r*0.3} ${r*0.2} l ${r*0.3} -${r*0.2} l ${r*0.3} ${r*0.2} l ${r*0.3} -${r*0.2}`} stroke="#FFD93D" strokeWidth={3} fill="none" />
      </G>;
      case 'xeni': return <G>
        <Circle cx={cx} cy={cy} r={r} fill={c.color} />
        {commonEyes(-1)}
        <Path d={`M ${cx-r*0.35} ${mouthY} q ${r*0.35} ${r*0.4} ${r*0.7} 0`} stroke="#2D3436" strokeWidth={3} fill="none" />
        <Circle cx={cx+r*0.75} cy={cy-r*0.6} r={r*0.18} fill="#FFD93D" />
        <Path d={`M ${cx+r*0.75} ${cy-r*0.78} l 0 -${r*0.18}`} stroke="#FFD93D" strokeWidth={2} />
      </G>;
      case 'jean': return <G>
        <Circle cx={cx} cy={cy} r={r} fill={c.color} />
        <Circle cx={cx-eyeDx} cy={eyeY} r={eyeR*0.95} fill="#fff" stroke="#374151" strokeWidth={2} />
        <Circle cx={cx+eyeDx} cy={eyeY} r={eyeR*0.95} fill="#fff" stroke="#374151" strokeWidth={2} />
        <Circle cx={cx-eyeDx} cy={eyeY} r={eyeR*0.4} fill="#2D3436" /><Circle cx={cx+eyeDx} cy={eyeY} r={eyeR*0.4} fill="#2D3436" />
        <Path d={`M ${cx-r*0.25} ${mouthY+r*0.05} q ${r*0.25} ${r*0.12} ${r*0.5} 0`} stroke="#2D3436" strokeWidth={3} fill="none" />
        <Rect x={cx-r*0.45} y={cy-r*0.95} width={r*0.9} height={r*0.18} rx={4} fill="#374151" />
      </G>;
    }
  };

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <LinearGradient id={`bg-${id}-${season}`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={c.color} stopOpacity="0.25" />
          <Stop offset="1" stopColor={c.accent} stopOpacity="0.15" />
        </LinearGradient>
      </Defs>
      <Circle cx={cx} cy={cy} r={size*0.44} fill={`url(#bg-${id}-${season})`} />
      <SeasonDecor season={season} size={size} />
      {body()}
    </Svg>
  );
};

export const AnimatedEmotionCharacter: React.FC<{ id: CharacterId; size?: number; season: Season; label?: boolean; animate?: boolean }> = ({ id, size=110, season, label=true, animate=true }) => {
  const bob = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    if (!animate) { bob.setValue(0); scale.setValue(1); return; }
    const a = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: 1, duration: 1600 + (id.charCodeAt(0)%7)*120, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0, duration: 1600 + (id.charCodeAt(0)%7)*120, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    const b = Animated.loop(Animated.sequence([
      Animated.timing(scale, { toValue: 1.04, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]));
    a.start(); b.start();
    return () => { a.stop(); b.stop(); };
  }, [animate, id]);
  const ch = CHARACTERS.find(x=>x.id===id)!;
  const ty = bob.interpolate({ inputRange:[0,1], outputRange:[0,-6] });
  return (
    <View style={{ alignItems:'center', width: size + 12 }}>
      <Animated.View style={{ transform:[{ translateY: ty }, { scale }] }}>
        <CharacterFace id={id} size={size} season={season} />
      </Animated.View>
      {label && <>
        <Text style={{ fontSize: 12, fontWeight: '700', color: ch.color, marginTop: 2, textAlign:'center' }} numberOfLines={1}>{ch.fa.split(' ')[0]}</Text>
        <Text style={{ fontSize: 9, color: '#888', textAlign:'center' }} numberOfLines={1}>{ch.source}</Text>
      </>}
    </View>
  );
};

export const EmotionCharacterWorld: React.FC<{ compact?: boolean }> = ({ compact=false }) => {
  const { themeColors, isDark } = useTheme();
  const [season, setSeason] = React.useState<Season>('spring');
  const sources = ['Inside Out', 'Inside Out 2', 'Dream Productions'];
  return (
    <View style={[styles.wrap, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>🎭 دنیای شخصیت‌ها (زنده و انیمیشنی)</Text>
      <Text style={[styles.sub, { color: themeColors.textSecondary }]}>شخصیت‌های Inside Out، Inside Out 2 و Dream Productions در کنار تو — در تمام فصل‌ها</Text>
      <View style={styles.seasonRow}>
        {SEASONS.map(s => (
          <TouchableOpacity key={s.id} onPress={() => setSeason(s.id)} style={[styles.seasonChip, { borderColor: season===s.id ? s.decor : (isDark?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.1)'), backgroundColor: season===s.id ? s.decor+'33' : 'transparent' }]}>
            <Text style={{ fontSize: 12, color: themeColors.text }}>{s.emoji} {s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {sources.map(src => (
        <View key={src} style={{ marginTop: 10 }}>
          <Text style={[styles.group, { color: themeColors.primary }]}>{src === 'Inside Out' ? '🎬 Inside Out 1' : src === 'Inside Out 2' ? '🎬 Inside Out 2' : '🎬 Dream Productions'}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 6, gap: 6 }}>
            {CHARACTERS.filter(c=>c.source===src).map(c => (
              <AnimatedEmotionCharacter key={c.id+season} id={c.id} season={season} size={compact?92:110} />
            ))}
          </ScrollView>
        </View>
      ))}
      <Text style={[styles.hint, { color: themeColors.textSecondary }]}>فصل را تغییر بده تا شخصیت‌ها در تم بهاری/تابستانی/پاییزی/زمستانی کنار تو باشند.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 20, marginBottom: 24, padding: 14, borderRadius: 18, borderWidth: 1 },
  title: { fontSize: 17, fontWeight: '800', marginBottom: 4 },
  sub: { fontSize: 12, lineHeight: 18, marginBottom: 10 },
  seasonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  seasonChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, borderWidth: 1 },
  group: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  hint: { fontSize: 11, marginTop: 8, textAlign: 'center' },
});

export default EmotionCharacterWorld;
