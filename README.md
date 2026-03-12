# Configuración de Cotización (Clientes) v2

Módulo para ajustar parámetros de cotización por planta (sede): márgenes y reglas asociados a operaciones según rangos de volumen (300 kg, 500 kg, 1T, 3T, 5T, 10T, 20T, 30T).

## Stack

- **Backend:** Node.js 20, GraphQL, Prisma
- **Frontend:** React 18, Apollo Client, TailwindCSS

## Estructura del repositorio

```
quotation-config/
├── backend/           # API GraphQL + Prisma → backend/README.md
│   └── prisma/
├── frontend/          # Aplicación React
│   └── src/features/indirect-costs/   # Módulo Costos indirectos
├── docs/
├── docker-compose.yml # PostgreSQL local
└── README.md
```

- **Backend:** [backend/README.md](backend/README.md) — API GraphQL, Prisma, scripts y variables de entorno.
- **Frontend — Costos indirectos:** [frontend/src/features/indirect-costs/README.md](frontend/src/features/indirect-costs/README.md).

## Prerrequisitos

- Node.js >= 20
- npm >= 9
- PostgreSQL (Docker o local)

## Instalación

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

## Base de datos

`docker-compose up -d` (credenciales en `docker-compose.yml`; `backend/.env.example` coincide). Luego en `backend/`: `npm run prisma:migrate`. Sin Docker: configurar `DATABASE_URL` en `backend/.env` y ejecutar las migraciones.

[docs/ENTITY_RELATIONSHIPS.md](docs/ENTITY_RELATIONSHIPS.md) · [docs/DOCKER.md](docs/DOCKER.md)

## Ejecución

```bash
cd backend && npm run dev
cd frontend && npm run dev   # otra terminal
```

Backend: `http://localhost:4000`.

## Convención de ramas

- Formato: `feature/<nombre>` (ej. `feature/cotizacion-clientes`).

Convención de ramas: [GIT_WORKFLOW.md](GIT_WORKFLOW.md).
