import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  towers: [
    { id: 'T001', name: 'Tower Alpha', status: 'active', plants: 48, utilization: 92, location: 'Zone A', cycle: 'Basil Cycle 3', startDate: '2026-04-15', daysLeft: 12 },
    { id: 'T002', name: 'Tower Beta', status: 'active', plants: 36, utilization: 78, location: 'Zone B', cycle: 'Lettuce Cycle 1', startDate: '2026-04-28', daysLeft: 25 },
    { id: 'T003', name: 'Tower Gamma', status: 'maintenance', plants: 0, utilization: 0, location: 'Zone A', cycle: 'Idle', startDate: null, daysLeft: null },
    { id: 'T004', name: 'Tower Delta', status: 'offline', plants: 24, utilization: 0, location: 'Zone C', cycle: 'Mint Cycle 2', startDate: '2026-04-10', daysLeft: 5 },
  ],
  plants: [
    { id: 'P001', name: 'Basil', scientific: 'Ocimum basilicum', tower: 'T001', stage: 'flowering', health: 95, daysToHarvest: 12, plantedDate: '2026-04-15', expectedYield: '2.8 kg', disease: 'None' },
    { id: 'P002', name: 'Lettuce', scientific: 'Lactuca sativa', tower: 'T002', stage: 'growth', health: 88, daysToHarvest: 25, plantedDate: '2026-04-28', expectedYield: '3.5 kg', disease: 'None' },
    { id: 'P003', name: 'Mint', scientific: 'Mentha piperita', tower: 'T004', stage: 'early', health: 72, daysToHarvest: 35, plantedDate: '2026-04-25', expectedYield: '1.9 kg', disease: 'Low Risk' },
    { id: 'P004', name: 'Spinach', scientific: 'Spinacia oleracea', tower: 'T002', stage: 'mature', health: 91, daysToHarvest: 8, plantedDate: '2026-04-10', expectedYield: '2.2 kg', disease: 'None' },
  ],
  automation: {
    waterSpray: true,
    phControl: true,
    nutrientDosing: true,
    coolingFan: false,
    ledLighting: true,
    waterRefill: true,
  },
  stats: {
    totalTowers: 4,
    activeTowers: 2,
    offlineTowers: 1,
    maintenanceTowers: 1,
    totalPlants: 108,
    waterUsageToday: 124, // liters
    electricityToday: 8.4, // kWh
    dailyYield: 1.8, // kg
    monthlyYield: 48.6, // kg
  },
  harvestLogs: [
    { id: 'H001', tower: 'T001', crop: 'Basil',   weight: 2.8, date: '2026-04-30', notes: 'Excellent yield, very aromatic' },
    { id: 'H002', tower: 'T002', crop: 'Lettuce', weight: 3.5, date: '2026-04-28', notes: 'Good quality, slight tip burn' },
    { id: 'H003', tower: 'T002', crop: 'Spinach', weight: 2.1, date: '2026-04-20', notes: 'Healthy crop' },
    { id: 'H004', tower: 'T001', crop: 'Basil',   weight: 2.6, date: '2026-04-10', notes: 'Slightly early harvest due to crowding' },
  ],
  nutrientSchedules: [
    { id: 'N001', tower: 'T001', name: 'Vegetative Mix',  nitrogen: 150, phosphorus: 50,  potassium: 200, calcium: 120, frequency: 'Every 6h', active: true  },
    { id: 'N002', tower: 'T002', name: 'Flowering Boost', nitrogen: 100, phosphorus: 120, potassium: 250, calcium: 100, frequency: 'Every 8h', active: true  },
    { id: 'N003', tower: 'T003', name: 'Maintenance Mix', nitrogen: 80,  phosphorus: 40,  potassium: 160, calcium: 90,  frequency: 'Every 12h', active: false },
  ],
}

const farmSlice = createSlice({
  name: 'farm',
  initialState,
  reducers: {
    toggleAutomation: (state, action) => {
      const key = action.payload
      if (key in state.automation) state.automation[key] = !state.automation[key]
    },
    updateTowerStatus: (state, action) => {
      const { id, status } = action.payload
      const tower = state.towers.find(t => t.id === id)
      if (tower) tower.status = status
    },
    addTower: (state, action) => {
      state.towers.push(action.payload)
      state.stats.totalTowers = state.towers.length
      state.stats.activeTowers = state.towers.filter(t => t.status === 'active').length
    },
    updateTower: (state, action) => {
      const idx = state.towers.findIndex(t => t.id === action.payload.id)
      if (idx !== -1) state.towers[idx] = { ...state.towers[idx], ...action.payload }
      state.stats.activeTowers = state.towers.filter(t => t.status === 'active').length
    },
    deleteTower: (state, action) => {
      state.towers = state.towers.filter(t => t.id !== action.payload)
      state.stats.totalTowers = state.towers.length
      state.stats.activeTowers = state.towers.filter(t => t.status === 'active').length
    },
    addPlant: (state, action) => { state.plants.push(action.payload) },
    updatePlant: (state, action) => {
      const idx = state.plants.findIndex(p => p.id === action.payload.id)
      if (idx !== -1) state.plants[idx] = { ...state.plants[idx], ...action.payload }
    },
    deletePlant: (state, action) => { state.plants = state.plants.filter(p => p.id !== action.payload) },
    addHarvestLog: (state, action) => { state.harvestLogs.unshift(action.payload) },
    deleteHarvestLog: (state, action) => { state.harvestLogs = state.harvestLogs.filter(h => h.id !== action.payload) },
    addNutrientSchedule: (state, action) => { state.nutrientSchedules.push(action.payload) },
    updateNutrientSchedule: (state, action) => {
      const idx = state.nutrientSchedules.findIndex(n => n.id === action.payload.id)
      if (idx !== -1) state.nutrientSchedules[idx] = { ...state.nutrientSchedules[idx], ...action.payload }
    },
    deleteNutrientSchedule: (state, action) => { state.nutrientSchedules = state.nutrientSchedules.filter(n => n.id !== action.payload) },
  },
})

export const {
  toggleAutomation, updateTowerStatus,
  addTower, updateTower, deleteTower,
  addPlant, updatePlant, deletePlant,
  addHarvestLog, deleteHarvestLog,
  addNutrientSchedule, updateNutrientSchedule, deleteNutrientSchedule,
} = farmSlice.actions
export default farmSlice.reducer
