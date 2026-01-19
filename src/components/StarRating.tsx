import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface StarRatingProps {
  value: number | null;
  onChange: (rating: number) => void;
  max?: number;
  size?: number;
  disabled?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  max = 5,
  size = 40,
  disabled = false,
}) => {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {Array.from({ length: max }, (_, index) => {
        const starNumber = index + 1;
        const isFilled = value !== null && starNumber <= value;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => !disabled && onChange(starNumber)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: size, opacity: disabled ? 0.5 : 1 }}>
              {isFilled ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
