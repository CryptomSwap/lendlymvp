import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RegisterInput, LoginInput, ApiResponse } from '@/shared/schemas'
import { API_ENDPOINTS } from '@/shared/constants'

const API_BASE_URL = 'http://localhost:3001'

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export function useAuth() {
  const queryClient = useQueryClient()

  const login = useMutation({
    mutationFn: async (data: LoginInput) => {
      return apiRequest(API_ENDPOINTS.auth.login, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  })

  const register = useMutation({
    mutationFn: async (data: RegisterInput) => {
      return apiRequest(API_ENDPOINTS.auth.register, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  })

  const logout = useMutation({
    mutationFn: async () => {
      // In a real app, you'd call the logout endpoint
      queryClient.clear()
    },
  })

  return {
    login: login.mutateAsync,
    register: register.mutateAsync,
    logout: logout.mutateAsync,
    isLoading: login.isPending || register.isPending,
  }
}

export function useItems() {
  const queryClient = useQueryClient()

  const getItems = useMutation({
    mutationFn: async (params: Record<string, any> = {}) => {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      
      return apiRequest(`${API_ENDPOINTS.items.list}?${searchParams.toString()}`)
    },
  })

  const getItem = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(API_ENDPOINTS.items.get(id))
    },
  })

  const createItem = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(API_ENDPOINTS.items.create, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  return {
    getItems: getItems.mutateAsync,
    getItem: getItem.mutateAsync,
    createItem: createItem.mutateAsync,
    isLoading: getItems.isPending || getItem.isPending || createItem.isPending,
  }
}

export function useBookings() {
  const queryClient = useQueryClient()

  const getBookings = useMutation({
    mutationFn: async (params: Record<string, any> = {}) => {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      
      return apiRequest(`${API_ENDPOINTS.bookings.list}?${searchParams.toString()}`)
    },
  })

  const getBooking = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(API_ENDPOINTS.bookings.get(id))
    },
  })

  const createBooking = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(API_ENDPOINTS.bookings.create, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })

  return {
    getBookings: getBookings.mutateAsync,
    getBooking: getBooking.mutateAsync,
    createBooking: createBooking.mutateAsync,
    isLoading: getBookings.isPending || getBooking.isPending || createBooking.isPending,
  }
}
