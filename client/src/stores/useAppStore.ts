import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  language: 'es' | 'en';
  currentView: 'home' | 'currency' | 'category' | 'favorites' | 'settings' | 'more' | 'recent-conversions' | 'about' | 'contact' | 'privacy' | 'terms';
  currentCategory: string;
  isSearchOpen: boolean;
  searchQuery: string;
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setLanguage: (language: 'es' | 'en') => void;
  setCurrentView: (view: AppState['currentView']) => void;
  setCurrentCategory: (category: string) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      language: 'es',
      currentView: 'home',
      currentCategory: '',
      isSearchOpen: false,
      searchQuery: '',

      setTheme: (theme) => set({ theme }),
      
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      setLanguage: (language) => set({ language }),
      
      setCurrentView: (currentView) => set({ currentView }),
      
      setCurrentCategory: (currentCategory) => set({ currentCategory }),
      
      setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
      
      setSearchQuery: (searchQuery) => set({ searchQuery }),
    }),
    {
      name: 'convertscope-app-store',
      partialize: (state) => ({ 
        theme: state.theme, 
        language: state.language 
      }),
    }
  )
);
