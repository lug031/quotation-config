# PostgreSQL con Docker

Servicio definido en `docker-compose.yml`: PostgreSQL 16 Alpine, puerto 5432.

| Parámetro | Valor |
|-----------|--------|
| Usuario / contraseña / BD | `user` / `password` / `quotation_config` |
| Conexión | `postgresql://user:password@localhost:5432/quotation_config` |
| Volumen | `quotation_config_pgdata` |

**Comandos:** `docker-compose up -d` | `docker-compose down` | `docker-compose down -v` (borra datos).

**Puerto 5432 ocupado:** Cambiar en `docker-compose.yml` el mapeo (ej. `5433:5432`) y en `backend/.env` usar el puerto elegido en `DATABASE_URL`.
