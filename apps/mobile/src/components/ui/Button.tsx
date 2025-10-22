import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import * as Haptics from 'expo-haptics'

interface ButtonProps extends TouchableOpacityProps {
  title: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  className?: string
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onPress,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1)

  const handlePressIn = () => {
    scale.value = withSpring(0.95)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const handlePressOut = () => {
    scale.value = withSpring(1)
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-500'
      case 'secondary':
        return 'bg-secondary-500'
      case 'outline':
        return 'border-2 border-primary-500 bg-transparent'
      case 'ghost':
        return 'bg-transparent'
      default:
        return 'bg-primary-500'
    }
  }

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return 'text-white'
      case 'secondary':
        return 'text-white'
      case 'outline':
        return 'text-primary-500'
      case 'ghost':
        return 'text-primary-500'
      default:
        return 'text-white'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2'
      case 'md':
        return 'px-6 py-3'
      case 'lg':
        return 'px-8 py-4'
      default:
        return 'px-6 py-3'
    }
  }

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-sm'
      case 'md':
        return 'text-base'
      case 'lg':
        return 'text-lg'
      default:
        return 'text-base'
    }
  }

  return (
    <GestureDetector
      gesture={Gesture.Tap()
        .onBegin(handlePressIn)
        .onFinalize(handlePressOut)}
    >
      <AnimatedTouchableOpacity
        style={animatedStyle}
        className={`
          ${getVariantStyles()}
          ${getSizeStyles()}
          rounded-2xl
          items-center
          justify-center
          min-h-[44px]
          ${disabled ? 'opacity-50' : ''}
          ${className}
        `}
        onPress={onPress}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'outline' || variant === 'ghost' ? '#0EA5A5' : 'white'}
          />
        ) : (
          <Text
            className={`
              ${getTextStyles()}
              ${getTextSizeStyles()}
              font-medium
            `}
          >
            {title}
          </Text>
        )}
      </AnimatedTouchableOpacity>
    </GestureDetector>
  )
}
