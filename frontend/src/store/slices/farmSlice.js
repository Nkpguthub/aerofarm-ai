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
  yieldData: Array.from({ length: 30 }, (_, i) => ({
    day: `May ${i + 1}`,
    yield: +(1.2 + Math.random() * 1.8).toFixed(2),
    water: +(100 + Math.random() * 60).toFixed(0),
    revenue: +(180 + Math.random() * 140).toFixed(0),
  })),
}

const farmSlice = createSlice({
  name: 'farm',
  initialState,
  reducers: {
    toggleAutomation: (state, action) => {
      const key = action.payload
      if (key in state.automation) {
        state.automation[key] = !state.automation[key]
      }
    },
    updateTowerStatus: (state, action) => {
      const { id, status } = action.payload
      const tower = state.towers.find(t => t.id === id)
      if (tower) tower.status = status
    },
  },
})

export const { toggleAutomation, updateTowerStatus } = farmSlice.actions
export default farmSlice.reducer
