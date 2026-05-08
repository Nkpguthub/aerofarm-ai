import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import sensorsReducer from './slices/sensorsSlice'
import notificationsReducer from './slices/notificationsSlice'
import farmReducer from './slices/farmSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    sensors: sensorsReducer,
    notifications: notificationsReducer,
    farm: farmReducer,
  },
})
