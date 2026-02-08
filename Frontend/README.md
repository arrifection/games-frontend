# Health Frontend

A modern React frontend for the FastAPI health backend.

## Prerequisites

- Node.js 18+ installed
- Backend server running on `http://127.0.0.1:8000`

## Installation

```bash
cd Frontend
npm install
```

## Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Features

- **BMI Calculator**: Calculate your Body Mass Index with support for both meters and feet/inches input
- **Health Advice**: Get personalized health recommendations based on your BMI category
- **Responsive Design**: Works beautifully on desktop and mobile
- **Modern UI**: Glassmorphism effects, smooth animations, and elegant color palette

## Tech Stack

- React 18
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API calls
- Lucide React for icons

## Folder Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── BMICalculator.jsx
│   │   └── AdvicePanel.jsx
│   ├── services/
│   │   └── api.js        # API service layer
│   ├── utils/
│   │   └── cn.js         # Class name utilities
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```
