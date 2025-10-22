import React from 'react'
import { View, ViewProps } from 'react-native'
import { BlurView } from 'expo-blur'
import { Platform } from 'react-native'

interface GlassCardProps extends ViewProps {
  children: React.ReactNode
  intensity?: number
  tint?: 'light' | 'dark'
  className?: string
}

export function GlassCard({
  children,
  intensity = 20,
  tint = 'light',
  className = '',
  ...props
}: GlassCardProps) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={intensity}
        tint={tint}
        className={`
          rounded-3xl
          border border-white/20
          shadow-lg
          ${className}
        `}
        {...props}
      >
        {children}
      </BlurView>
    )
  }

  // Fallback for Android
  return (
    <View
      className={`
        rounded-3xl
        bg-white/90
        border border-white/20
        shadow-lg
        ${className}
      `}
      {...props}
    >
      {children}
    </View>
  )
}
