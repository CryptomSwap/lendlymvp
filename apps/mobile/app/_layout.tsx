import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { I18nManager } from 'react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as Font from 'expo-font'

// Enable RTL
I18nManager.allowRTL(true)
I18nManager.forceRTL(true)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

export default function RootLayout() {
  useEffect(() => {
    // Load fonts
    Font.loadAsync({
      'Rubik-Regular': require('../assets/fonts/Rubik-Regular.ttf'),
      'Rubik-Medium': require('../assets/fonts/Rubik-Medium.ttf'),
      'Rubik-Bold': require('../assets/fonts/Rubik-Bold.ttf'),
      'Heebo-Regular': require('../assets/fonts/Heebo-Regular.ttf'),
      'Heebo-Medium': require('../assets/fonts/Heebo-Medium.ttf'),
      'Heebo-Bold': require('../assets/fonts/Heebo-Bold.ttf'),
    })
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="item/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="booking/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="checklist/pickup" options={{ headerShown: false }} />
            <Stack.Screen name="checklist/return" options={{ headerShown: false }} />
            <Stack.Screen name="owner" options={{ headerShown: false }} />
            <Stack.Screen name="admin" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="dark" backgroundColor="#0EA5A5" />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
