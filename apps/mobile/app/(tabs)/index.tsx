import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Search, MapPin, Star, ArrowLeft } from 'lucide-react-native'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { he } from '@/shared/i18n'
import { CATEGORIES } from '@/shared/constants'

export default function HomeScreen() {
  const categories = Object.keys(CATEGORIES).slice(0, 6)

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-primary-50 to-secondary-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-3xl font-bold text-primary-500">
                Lendly
              </Text>
              <Text className="text-base text-text-secondary">
                {he.home.subtitle}
              </Text>
            </View>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              onPress={() => router.push('/profile')}
            >
              <ArrowLeft size={20} color="#0EA5A5" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            className="flex-row items-center bg-white/80 rounded-2xl px-4 py-3 mb-6"
            onPress={() => router.push('/browse')}
          >
            <Search size={20} color="#94A3B8" />
            <Text className="flex-1 text-text-secondary mr-3">
              {he.home.searchPlaceholder}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-text-primary mb-4">
            {he.home.popularCategories}
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category}
                className="w-1/2 px-2 mb-4"
                onPress={() => router.push(`/browse?category=${encodeURIComponent(category)}`)}
              >
                <GlassCard className="p-4 h-24">
                  <View className="flex-1 justify-center items-center">
                    <Text className="text-sm font-medium text-text-primary text-center">
                      {category}
                    </Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-text-primary mb-4">
            {he.home.howItWorks}
          </Text>
          <View className="space-y-4">
            {[
              { step: he.home.step1, desc: he.home.step1Desc },
              { step: he.home.step2, desc: he.home.step2Desc },
              { step: he.home.step3, desc: he.home.step3Desc },
              { step: he.home.step4, desc: he.home.step4Desc },
            ].map((item, index) => (
              <GlassCard key={index} className="p-4">
                <View className="flex-row items-start">
                  <View className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center mr-3">
                    <Text className="text-white font-bold text-sm">
                      {index + 1}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-text-primary mb-1">
                      {item.step}
                    </Text>
                    <Text className="text-sm text-text-secondary">
                      {item.desc}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            ))}
          </View>
        </View>

        {/* CTA */}
        <View className="px-6 pb-8">
          <Button
            title="התחל לחפש ציוד"
            onPress={() => router.push('/browse')}
            size="lg"
            className="mb-4"
          />
          <Button
            title="פרסם ציוד שלך"
            variant="outline"
            onPress={() => router.push('/owner')}
            size="lg"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
