import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Audio } from 'expo-av';

interface MusicState {
  isPlaying: boolean;
  currentTrack: string | null;
  volume: number;
  play: (track: string) => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  setVolume: (volume: number) => void;
}

const MusicContext = createContext<MusicState | null>(null);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(0.5);

  const unload = async () => {
    if (sound) {
      try { await sound.unloadAsync(); } catch {}
      setSound(null);
    }
  };

  const play = async (track: string) => {
    try {
      await unload();
      setCurrentTrack(track);
      // No bundled audio assets yet; keep app runnable without crashing.
      if (track.startsWith('http://') || track.startsWith('https://') || track.startsWith('file://')) {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: track }, { shouldPlay: true, isLooping: true, volume });
        setSound(newSound);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    } catch (error) {
      console.warn('Play unavailable:', error);
      setIsPlaying(false);
    }
  };

  const pause = async () => {
    if (sound) {
      try { await sound.pauseAsync(); } catch {}
    }
    setIsPlaying(false);
  };

  const stop = async () => {
    try {
      if (sound) await sound.stopAsync();
    } catch {}
    await unload();
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const setVolume = async (newVolume: number) => {
    setVolumeState(newVolume);
    if (sound) {
      try { await sound.setVolumeAsync(newVolume); } catch {}
    }
  };

  useEffect(() => {
    return () => { void unload(); };
  }, [sound]);

  return (
    <MusicContext.Provider value={{ isPlaying, currentTrack, volume, play, pause, stop, setVolume }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
};