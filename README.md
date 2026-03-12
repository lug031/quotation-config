# Configuración de Cotización (Clientes) v2

Módulo para ajustar parámetros de cotización por planta (sede): márgenes y reglas asociados a operaciones según rangos de volumen (300 kg, 500 kg, 1T, 3T, 5T, 10T, 20T, 30T).

## Stack

- **Backend:** Node.js 20, GraphQL, Prisma
- **Frontend:** React 18, Apollo Client, TailwindCSS

## Estructura del repositorio

```
quotation-config/
├── backend/           # API GraphQL + Prisma (Dockerfile) → backend/README.md
├── frontend/          # Aplicación React + Vite (Dockerfile) → frontend/README.md
├── docs/              # ENTITY_RELATIONSHIPS.md, DOCKER.md, seed-data.graphql
├── docker-compose.yml # PostgreSQL + backend + frontend
├── GIT_WORKFLOW.md    # Convención de ramas y flujo Git
└── README.md
```

- **Backend:** [backend/README.md](backend/README.md) — API GraphQL, Prisma, scripts y variables de entorno.
- **Frontend:** [frontend/README.md](frontend/README.md) — aplicación React.

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

Sin Docker: configurar `DATABASE_URL` en `backend/.env` y ejecutar `npm run prisma:migrate` en `backend/`. Con Docker: ver [Ejecución con Docker](#ejecución-con-docker).

**Datos de prueba:** Para cargar plantas y operaciones de ejemplo, ejecutar las mutations de [docs/seed-data.graphql](docs/seed-data.graphql) en el GraphQL Playground (`http://localhost:4000`).

[docs/ENTITY_RELATIONSHIPS.md](docs/ENTITY_RELATIONSHIPS.md) · [docs/DOCKER.md](docs/DOCKER.md)

## Ejecución (local)

```bash
cd backend && npm run dev
cd frontend && npm run dev   # otra terminal
```

- **Backend:** `http://localhost:4000`
- **Frontend:** `http://localhost:5173`

## Ejecución con Docker

Desde la raíz del repo se pueden levantar PostgreSQL, backend y frontend con Docker Compose:

```bash
docker compose up -d
```

Tras el primer build, para reconstruir tras cambios:

```bash
docker compose up -d --build
```

| Servicio   | URL                    |
|-----------|------------------------|
| Backend   | http://localhost:4000  |
| Frontend  | http://localhost:8080  |

Las migraciones se aplican al arrancar el backend. Detalle de servicios, puertos y variables: [docs/DOCKER.md](docs/DOCKER.md).

## Convención de ramas

Formato: `feature/<nombre>` (ej. `feature/cotizacion-clientes`). Detalle: [GIT_WORKFLOW.md](GIT_WORKFLOW.md).
