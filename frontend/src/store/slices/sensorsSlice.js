import { createSlice } from '@reduxjs/toolkit'

// Simulated real-time sensor data
const generateSensorData = () => ({
  ph: +(5.8 + Math.random() * 0.8).toFixed(2),
  temperature: +(22 + Math.random() * 4).toFixed(1),
  humidity: +(65 + Math.random() * 20).toFixed(1),
  waterLevel: +(70 + Math.random() * 25).toFixed(1),
  ec: +(1.8 + Math.random() * 0.6).toFixed(2),
  lightIntensity: +(600 + Math.random() * 400).toFixed(0),
  pumpStatus: Math.random() > 0.3,
  timestamp: new Date().toISOString(),
})

const generateHistory = (count = 24) =>
  Array.from({ length: count }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    ph: +(5.8 + Math.random() * 0.8).toFixed(2),
    temperature: +(22 + Math.random() * 5).toFixed(1),
    humidity: +(60 + Math.random() * 25).toFixed(1),
    ec: +(1.8 + Math.random() * 0.6).toFixed(2),
    waterLevel: +(65 + Math.random() * 30).toFixed(1),
  }))

const initialState = {
  towers: [
    { id: 'T001', name: 'Tower Alpha', ...generateSensorData(), status: 'active' },
    { id: 'T002', name: 'Tower Beta', ...generateSensorData(), status: 'active' },
    { id: 'T003', name: 'Tower Gamma', ...generateSensorData(), status: 'maintenance' },
    { id: 'T004', name: 'Tower Delta', ...generateSensorData(), status: 'offline' },
  ],
  selected: 'T001',
  history: generateHistory(),
  lastUpdated: new Date().toISOString(),
  connected: true,
}

const sensorsSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {
    updateSensorData: (state, action) => {
      const { towerId, data } = action.payload
      const tower = state.towers.find(t => t.id === towerId)
      if (tower) Object.assign(tower, data)
      state.lastUpdated = new Date().toISOString()
    },
    tickSensors: (state) => {
      // Simulate real-time fluctuations
      state.towers.forEach(tower => {
        if (tower.status === 'active') {
          tower.ph = +(tower.ph + (Math.random() - 0.5) * 0.05).toFixed(2)
          tower.temperature = +(tower.temperature + (Math.random() - 0.5) * 0.2).toFixed(1)
          tower.humidity = +(tower.humidity + (Math.random() - 0.5) * 0.5).toFixed(1)
          tower.ec = +(tower.ec + (Math.random() - 0.5) * 0.02).toFixed(2)
          tower.timestamp = new Date().toISOString()
        }
      })
      state.lastUpdated = new Date().toISOString()
    },
    selectTower: (state, action) => {
      state.selected = action.payload
    },
    setConnected: (state, action) => {
      state.connected = action.payload
    },
  },
})

export const { updateSensorData, tickSensors, selectTower, setConnected } = sensorsSlice.actions
export default sensorsSlice.reducer
