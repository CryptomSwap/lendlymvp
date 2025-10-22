import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/Button'

export default function ProfileScreen() {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.replace('/(auth)/login')
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8">
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-primary-500 items-center justify-center mb-4">
            <Text className="text-white text-2xl font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Text>
          </View>
          <Text className="text-xl font-bold text-text-primary">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className="text-text-secondary">
            {user?.email}
          </Text>
        </View>

        <View className="space-y-4">
          <Button
            title="ערוך פרופיל"
            variant="outline"
            onPress={() => {}}
          />
          <Button
            title="הגדרות"
            variant="outline"
            onPress={() => {}}
          />
          <Button
            title="עזרה"
            variant="outline"
            onPress={() => {}}
          />
          <Button
            title="התנתק"
            variant="ghost"
            onPress={handleLogout}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
