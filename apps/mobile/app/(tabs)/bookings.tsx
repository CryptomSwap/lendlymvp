import React from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function BookingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-text-primary">
          הזמנות שלי
        </Text>
        <Text className="text-text-secondary mt-2">
          כאן יוצגו כל ההזמנות שלך
        </Text>
      </View>
    </SafeAreaView>
  )
}
