import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {
    id: 1,
    name: 'Mehul Patel',
    email: 'mehul@aerofarm.io',
    role: 'FARMER', // 'FARMER' | 'ADMIN'
    avatar: null,
    farmName: 'Green Valley Aeroponics',
  },
  token: 'mock-jwt-token',
  isAuthenticated: true,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => { state.loading = true; state.error = null },
    loginSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    setRole: (state, action) => {
      if (state.user) state.user.role = action.payload
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, setRole } = authSlice.actions
export default authSlice.reducer
