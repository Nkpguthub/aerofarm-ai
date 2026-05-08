# AeroFarm AI
> **Smart Aeroponic Farming Management Platform** — AI-powered, IoT-integrated, real-time monitoring

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🚀 Tech Stack
- **Frontend**: React 19 + Vite + Tailwind CSS v4 + Framer Motion + Redux Toolkit
- **Backend**: Java Spring Boot 3.3 + Spring Security (JWT) + WebSocket (STOMP)
- **Database**: MySQL 8
- **IoT**: MQTT + ESP32 sensors

## 📦 Local Development

```bash
# Frontend
cd frontend
npm install
npm run dev   # → http://localhost:5173

# Backend
cd backend
mvn spring-boot:run   # → http://localhost:8080
```

## 🌐 Free Deployment

| Service | Purpose | Free Tier |
|---|---|---|
| [Vercel](https://vercel.com) | Frontend | Unlimited |
| [Render.com](https://render.com) | Backend (Spring Boot) | 750 hrs/mo |
| [Railway](https://railway.app) | MySQL Database | 500 MB |

## 🔑 Environment Variables

### Frontend (Vercel)
| Variable | Value |
|---|---|
| `VITE_API_URL` | Your Render backend URL |

### Backend (Render)
| Variable | Value |
|---|---|
| `SPRING_DATASOURCE_URL` | Railway MySQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | Railway DB username |
| `SPRING_DATASOURCE_PASSWORD` | Railway DB password |
| `JWT_SECRET` | Your secret key (32+ chars) |
