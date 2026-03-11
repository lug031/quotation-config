# Configuración de Cotización (Clientes) v2

Módulo para ajustar parámetros de cotización por planta (sede): márgenes y reglas asociados a operaciones según rangos de volumen (300 kg, 500 kg, 1T, 3T, 5T, 10T, 20T, 30T).

## Stack

- **Backend:** Node.js 20, GraphQL, Prisma
- **Frontend:** React 18, Apollo Client, TailwindCSS o Material UI

## Estructura del repositorio

```
quotation-config/
├── backend/     # API GraphQL + Prisma
├── frontend/    # Aplicación React
└── README.md
```

## Prerrequisitos

- Node.js >= 20
- npm >= 9
- Base de datos (PostgreSQL o MySQL) para el backend

## Instalación

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

## Ejecución

```bash
# Backend
cd backend && npm run dev

# Frontend (en otra terminal)
cd frontend && npm run dev
```

## Convención de ramas

- Formato: `feature/<nombre>` (ej. `feature/cotizacion-clientes`).
