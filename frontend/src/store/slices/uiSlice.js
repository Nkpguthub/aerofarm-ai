import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'dark', // 'dark' | 'light'
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  language: 'en',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', state.theme)
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      document.documentElement.setAttribute('data-theme', action.payload)
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    toggleMobileSidebar: (state) => {
      state.mobileSidebarOpen = !state.mobileSidebarOpen
    },
    closeMobileSidebar: (state) => {
      state.mobileSidebarOpen = false
    },
    setLanguage: (state, action) => {
      state.language = action.payload
    },
  },
})

export const {
  toggleTheme, setTheme, toggleSidebar,
  toggleMobileSidebar, closeMobileSidebar, setLanguage,
} = uiSlice.actions
export default uiSlice.reducer
