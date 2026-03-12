# Docker

## Servicios

| Servicio   | Puerto (host) | Imagen / build      |
|-----------|---------------|----------------------|
| `postgres` | 5432          | `postgres:16-alpine` |
| `backend`  | 4000          | `./backend` (Dockerfile) |
| `frontend` | 8080 → 80     | `./frontend` (Dockerfile) |

## Comandos

```bash
docker compose up -d
docker compose up -d --build
docker compose logs -f
docker compose down
docker compose down -v
```

## Variables

- **PostgreSQL:** `user` / `password` / `quotation_config`. Conexión desde el host: `postgresql://user:password@localhost:5432/quotation_config`.
- **Backend:** usa `DATABASE_URL` apuntando a `postgres:5432` en la red de Docker.
- **Frontend:** la URL del API se define con el build-arg `VITE_GRAPHQL_URL` (por defecto `http://localhost:4000`).

## URLs

- API GraphQL: http://localhost:4000  
- Aplicación web: http://localhost:8080  

## Solo PostgreSQL

```bash
docker compose up -d postgres
```

Luego en `backend/.env` usar `DATABASE_URL=postgresql://user:password@localhost:5432/quotation_config`.
