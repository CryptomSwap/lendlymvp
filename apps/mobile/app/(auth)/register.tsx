import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema, RegisterInput } from '@/shared/schemas'
import { useAuthStore } from '@/store/auth'
import { useAuth } from '@/hooks/useAuth'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { he } from '@/shared/i18n'

export default function RegisterScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const { setUser, setTokens } = useAuthStore()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      city: '',
      password: '',
    },
  })

  const onSubmit = async (data: RegisterInput) => {
    try {
      setIsLoading(true)
      const result = await register(data)
      
      if (result.success) {
        setUser(result.data.user)
        setTokens({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        })
        router.replace('/(tabs)')
      } else {
        Alert.alert(he.common.error, result.error || he.auth.emailAlreadyExists)
      }
    } catch (error) {
      Alert.alert(he.common.error, he.errors.networkError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-primary-50 to-secondary-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center px-6">
            {/* Header */}
            <View className="items-center mb-8">
              <Text className="text-4xl font-bold text-primary-500 mb-2">
                Lendly
              </Text>
              <Text className="text-lg text-text-secondary text-center">
                {he.home.subtitle}
              </Text>
            </View>

            {/* Register Form */}
            <GlassCard className="p-6">
              <Text className="text-2xl font-bold text-text-primary mb-6 text-center">
                {he.auth.register}
              </Text>

              <View className="space-y-4">
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={he.auth.firstName}
                      placeholder="דוד"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.firstName?.message}
                      autoComplete="given-name"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={he.auth.lastName}
                      placeholder="כהן"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.lastName?.message}
                      autoComplete="family-name"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={he.auth.email}
                      placeholder="your@email.com"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.email?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={he.auth.phone}
                      placeholder="+972501234567"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.phone?.message}
                      keyboardType="phone-pad"
                      autoComplete="tel"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="city"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={he.auth.city}
                      placeholder="תל אביב-יפו"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.city?.message}
                      autoComplete="address-level2"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={he.auth.password}
                      placeholder="••••••••"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.password?.message}
                      secureTextEntry
                      autoComplete="new-password"
                    />
                  )}
                />

                <Button
                  title={he.auth.register}
                  onPress={handleSubmit(onSubmit)}
                  loading={isLoading}
                  className="mt-6"
                />

                <View className="flex-row justify-center items-center mt-4">
                  <Text className="text-text-secondary">
                    {he.auth.alreadyHaveAccount}
                  </Text>
                  <Link href="/(auth)/login" asChild>
                    <TouchableOpacity className="ml-2">
                      <Text className="text-primary-500 font-medium">
                        {he.auth.login}
                      </Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            </GlassCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
