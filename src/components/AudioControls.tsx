import React from 'react';
import { View, TouchableOpacity, Text, useColorScheme } from 'react-native';
import { PlayIcon, PauseIcon, StopIcon, SpeakerIcon } from './icons';
import { useAudioStore } from '../stores/useAudioStore';
import { LoadingSpinner } from './LoadingSpinner';

interface AudioControlsProps {
  globalAyahNumber: number;
  disabled?: boolean;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  globalAyahNumber,
  disabled = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { isPlaying, isLoaded, status, error } = useAudioStore();
  const { loadAndPlay, pause, stop, togglePlayPause } = useAudioStore();

  const handlePlay = async () => {
    if (!isLoaded) {
      await loadAndPlay(globalAyahNumber);
    } else {
      await togglePlayPause();
    }
  };

  const handleStop = async () => {
    await stop();
  };

  const isLoading = status === 'loading';

  return (
    <View style={{ marginVertical: 16 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* Play/Pause Button */}
        <TouchableOpacity
          onPress={handlePlay}
          disabled={disabled || isLoading}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: disabled || isLoading ? '#9ca3af' : '#10b981',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <LoadingSpinner size="small" color="#ffffff" />
          ) : isPlaying ? (
            <PauseIcon size={28} color="#ffffff" />
          ) : (
            <PlayIcon size={28} color="#ffffff" />
          )}
        </TouchableOpacity>

        {/* Stop Button */}
        {isLoaded && (
          <TouchableOpacity
            onPress={handleStop}
            disabled={disabled}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            activeOpacity={0.7}
          >
            <StopIcon size={20} color={isDark ? '#e5e7eb' : '#374151'} />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <Text
          style={{
            marginTop: 12,
            fontSize: 12,
            color: '#ef4444',
            textAlign: 'center',
          }}
        >
          {error}
        </Text>
      )}

      {/* Audio Status */}
      {isLoaded && !error && (
        <Text
          style={{
            marginTop: 12,
            fontSize: 12,
            color: isDark ? '#9ca3af' : '#6b7280',
            textAlign: 'center',
          }}
        >
          {isPlaying ? 'Playing audio...' : 'Audio ready'}
        </Text>
      )}
    </View>
  );
};
