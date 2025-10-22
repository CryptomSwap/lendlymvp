import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { Eye, EyeOff } from 'lucide-react-native'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  className?: string
  containerClassName?: string
}

export function Input({
  label,
  error,
  className = '',
  containerClassName = '',
  secureTextEntry,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  
  const borderColor = useSharedValue('#E5E7EB')
  const labelScale = useSharedValue(1)
  const labelTranslateY = useSharedValue(0)

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }))

  const animatedLabelStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: labelScale.value },
      { translateY: labelTranslateY.value },
    ],
  }))

  const handleFocus = () => {
    setIsFocused(true)
    borderColor.value = withTiming('#0EA5A5')
    if (props.value) {
      labelScale.value = withTiming(0.85)
      labelTranslateY.value = withTiming(-8)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    borderColor.value = withTiming('#E5E7EB')
    if (!props.value) {
      labelScale.value = withTiming(1)
      labelTranslateY.value = withTiming(0)
    }
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const isPassword = secureTextEntry && !isPasswordVisible

  return (
    <View className={`space-y-2 ${containerClassName}`}>
      {label && (
        <Animated.Text
          style={animatedLabelStyle}
          className={`
            text-sm font-medium text-text-secondary
            ${isFocused || props.value ? 'text-primary-500' : ''}
          `}
        >
          {label}
        </Animated.Text>
      )}
      
      <View className="relative">
        <Animated.View
          style={animatedBorderStyle}
          className={`
            border-2 rounded-xl bg-white px-4 py-3
            ${error ? 'border-error' : ''}
            ${isFocused ? 'border-primary-500' : ''}
          `}
        >
          <TextInput
            className={`
              text-base text-text-primary
              ${className}
            `}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={isPassword}
            placeholderTextColor="#94A3B8"
            {...props}
          />
        </Animated.View>

        {secureTextEntry && (
          <TouchableOpacity
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onPress={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color="#94A3B8" />
            ) : (
              <Eye size={20} color="#94A3B8" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-sm text-error">
          {error}
        </Text>
      )}
    </View>
  )
}
