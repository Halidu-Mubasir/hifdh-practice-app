import React from 'react';
import { TouchableOpacity, Text, View, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CategoryInfo } from '../types';

interface CategoryCardProps {
  category: CategoryInfo;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getGradientColors = (): [string, string] => {
    switch (category.id) {
      case 'juz':
        return ['#10b981', '#059669'];
      case 'last-5':
        return ['#f59e0b', '#d97706'];
      case 'last-10':
        return ['#3b82f6', '#2563eb'];
      case 'full-quran':
        return ['#8b5cf6', '#7c3aed'];
      default:
        return ['#10b981', '#059669'];
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ marginBottom: 16 }}>
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          padding: 20,
          minHeight: 140,
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: 4,
            }}
          >
            {category.arabicName}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#ffffff',
              opacity: 0.9,
            }}
          >
            {category.englishName}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 14,
            color: '#ffffff',
            opacity: 0.8,
            marginTop: 8,
          }}
        >
          {category.description}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
