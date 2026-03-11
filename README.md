# Configuración de Cotización (Clientes) v2

Módulo para ajustar parámetros de cotización por planta (sede): márgenes y reglas asociados a operaciones según rangos de volumen (300 kg, 500 kg, 1T, 3T, 5T, 10T, 20T, 30T).

## Stack

- **Backend:** Node.js 20, GraphQL, Prisma
- **Frontend:** React 18, Apollo Client, TailwindCSS o Material UI

## Estructura del repositorio

```
quotation-config/
├── backend/           # API GraphQL + Prisma
│   └── prisma/
├── frontend/          # Aplicación React
├── docs/
├── docker-compose.yml # PostgreSQL local
└── README.md
```

## Prerrequisitos

- Node.js >= 20
- npm >= 9
- Base de datos PostgreSQL (opcinal: docker-compose)

## Instalación

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

## Base de datos

**Con Docker:** `docker-compose up -d`. Credenciales en `docker-compose.yml`; `backend/.env.example` ya coincide. Luego `cd backend && npm run prisma:migrate`.

**Sin Docker:** Definir `DATABASE_URL` en `backend/.env` y ejecutar `npm run prisma:migrate` en `backend/`.

Modelo de datos: [docs/ENTITY_RELATIONSHIPS.md](docs/ENTITY_RELATIONSHIPS.md). Docker: [docs/DOCKER.md](docs/DOCKER.md).

## Ejecución

```bash
# Backend
cd backend && npm run dev   # API GraphQL en http://localhost:4000
# Frontend (en otra terminal)
cd frontend && npm run dev  # otra terminal
```

## Convención de ramas

- Formato: `feature/<nombre>` (ej. `feature/cotizacion-clientes`).
