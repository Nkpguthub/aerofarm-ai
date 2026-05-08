import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [
    { id: 1, type: 'alert', message: 'pH level in Tower Alpha is slightly high (6.8)', time: '2 min ago', read: false, severity: 'warning' },
    { id: 2, type: 'success', message: 'Harvest cycle completed for Tower Beta — 2.4 kg Basil', time: '1 hour ago', read: false, severity: 'success' },
    { id: 3, type: 'info', message: 'Nutrient dosing auto-adjusted for Tower Gamma', time: '3 hours ago', read: true, severity: 'info' },
    { id: 4, type: 'alert', message: 'Tower Delta offline — connectivity issue detected', time: '5 hours ago', read: false, severity: 'danger' },
    { id: 5, type: 'success', message: 'Water refill complete for Tower Alpha', time: '6 hours ago', read: true, severity: 'success' },
  ],
  unreadCount: 3,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift({ ...action.payload, id: Date.now(), read: false })
      state.unreadCount++
    },
    markRead: (state, action) => {
      const item = state.items.find(n => n.id === action.payload)
      if (item && !item.read) {
        item.read = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllRead: (state) => {
      state.items.forEach(n => { n.read = true })
      state.unreadCount = 0
    },
  },
})

export const { addNotification, markRead, markAllRead } = notificationsSlice.actions
export default notificationsSlice.reducer
