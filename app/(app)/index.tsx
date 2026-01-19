import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryCard, ArabicText } from '../../src/components';
import { CATEGORY_DEFINITIONS } from '../../src/constants';
import { useSessionStore } from '../../src/stores/useSessionStore';
import { useAuthStore } from '../../src/stores/useAuthStore';

export default function CategorySelectionScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { user, signOut } = useAuthStore();
  const { setCategory } = useSessionStore();

  const handleCategorySelect = (category: typeof CATEGORY_DEFINITIONS[0]) => {
    setCategory(category);
    router.push({
      pathname: '/(app)/configure',
      params: { categoryId: category.id },
    });
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#1f2937' : '#f9fafb' }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? '#374151' : '#e5e7eb',
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <ArabicText size={28} bold>
              حفظ
            </ArabicText>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: isDark ? '#f3f4f6' : '#1f2937',
                marginTop: 4,
              }}
            >
              Hifdh App
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            {user ? (
              <TouchableOpacity
                onPress={handleSignOut}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: isDark ? '#e5e7eb' : '#4b5563',
                  }}
                >
                  Sign Out
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => router.push('/(auth)/login')}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: '#10b981',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#ffffff',
                  }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {user && (
          <Text
            style={{
              fontSize: 14,
              color: isDark ? '#9ca3af' : '#6b7280',
              marginTop: 8,
            }}
          >
            {user.email}
          </Text>
        )}
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: isDark ? '#f3f4f6' : '#1f2937',
            marginBottom: 8,
          }}
        >
          Select Category
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: isDark ? '#9ca3af' : '#6b7280',
            marginBottom: 24,
          }}
        >
          Choose a category to start your practice session
        </Text>

        {CATEGORY_DEFINITIONS.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onPress={() => handleCategorySelect(category)}
          />
        ))}

        {/* Additional Options */}
        <View style={{ marginTop: 20, gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.push('/(app)/history')}
            style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: isDark ? '#374151' : '#ffffff',
              borderWidth: 1,
              borderColor: isDark ? '#4b5563' : '#e5e7eb',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: isDark ? '#f3f4f6' : '#1f2937',
              }}
            >
              📚 Session History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(app)/statistics')}
            style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: isDark ? '#374151' : '#ffffff',
              borderWidth: 1,
              borderColor: isDark ? '#4b5563' : '#e5e7eb',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: isDark ? '#f3f4f6' : '#1f2937',
              }}
            >
              📊 Statistics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(app)/offline')}
            style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: isDark ? '#374151' : '#ffffff',
              borderWidth: 1,
              borderColor: isDark ? '#4b5563' : '#e5e7eb',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: isDark ? '#f3f4f6' : '#1f2937',
              }}
            >
              📥 Offline Downloads
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
