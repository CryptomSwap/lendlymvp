import { create } from 'zustand'

export interface SearchFilters {
  category?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  latitude?: number
  longitude?: number
  radius?: number
}

interface SearchState {
  query: string
  filters: SearchFilters
  setQuery: (query: string) => void
  setFilters: (filters: Partial<SearchFilters>) => void
  clearFilters: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  filters: {},
  setQuery: (query) => set({ query }),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  clearFilters: () => set({ filters: {} }),
}))
