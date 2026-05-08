import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      monitoring: 'IoT Monitoring',
      automation: 'Automation',
      towers: 'Towers',
      plants: 'Plants',
      yield: 'Yield Analytics',
      ai: 'AI Recommendations',
      notifications: 'Notifications',
      admin: 'Admin Panel',
      settings: 'Settings',
      logout: 'Logout',

      // Dashboard
      totalTowers: 'Total Towers',
      activeTowers: 'Active Towers',
      offlineTowers: 'Offline Towers',
      totalPlants: 'Total Plants',
      waterUsage: 'Water Usage Today',
      electricity: 'Electricity Usage',
      dailyYield: 'Daily Yield',
      monthlyYield: 'Monthly Yield',

      // Sensors
      ph: 'pH Level',
      temperature: 'Temperature',
      humidity: 'Humidity',
      waterLevel: 'Water Level',
      ec: 'EC Level',
      light: 'Light Intensity',
      pump: 'Pump Status',

      // Status
      active: 'Active',
      offline: 'Offline',
      maintenance: 'Maintenance',
      online: 'Online',

      // Actions
      viewDetails: 'View Details',
      configure: 'Configure',
      save: 'Save',
      cancel: 'Cancel',
      refresh: 'Refresh',

      // Landing
      heroTitle: 'Future of Farming',
      heroSubtitle: 'is Here',
      heroDesc: 'Harness AI-powered aeroponic technology to grow 10x more with 95% less water. Real-time monitoring, automated controls, and predictive analytics — all in one platform.',
      getStarted: 'Start Growing',
      watchDemo: 'Watch Demo',
    },
  },
  hi: {
    translation: {
      dashboard: 'डैशबोर्ड',
      monitoring: 'IoT निगरानी',
      automation: 'स्वचालन',
      towers: 'टावर',
      plants: 'पौधे',
      yield: 'उपज विश्लेषण',
      ai: 'AI सिफारिशें',
      notifications: 'सूचनाएं',
      admin: 'व्यवस्थापक',
      settings: 'सेटिंग्स',
      logout: 'लॉग आउट',
      totalTowers: 'कुल टावर',
      activeTowers: 'सक्रिय टावर',
      offlineTowers: 'ऑफलाइन टावर',
      totalPlants: 'कुल पौधे',
      waterUsage: 'आज पानी का उपयोग',
      electricity: 'बिजली उपयोग',
      dailyYield: 'दैनिक उपज',
      monthlyYield: 'मासिक उपज',
      ph: 'pH स्तर',
      temperature: 'तापमान',
      humidity: 'आर्द्रता',
      waterLevel: 'जल स्तर',
      ec: 'EC स्तर',
      light: 'प्रकाश तीव्रता',
      pump: 'पंप स्थिति',
      active: 'सक्रिय',
      offline: 'ऑफलाइन',
      maintenance: 'रखरखाव',
      heroTitle: 'खेती का भविष्य',
      heroSubtitle: 'यहाँ है',
      heroDesc: 'AI-संचालित एरोपोनिक तकनीक से 10 गुना अधिक उगाएं, 95% कम पानी में।',
      getStarted: 'शुरू करें',
      watchDemo: 'डेमो देखें',
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
