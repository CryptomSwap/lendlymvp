import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  city?: string
  role: string
  isVerified: boolean
  createdAt: string
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}

interface AuthState {
  user: User | null
  tokens: Tokens | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setTokens: (tokens: Tokens | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTokens: (tokens) => set({ tokens }),
      logout: () => set({ user: null, tokens: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
