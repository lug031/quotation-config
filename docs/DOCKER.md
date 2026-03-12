# PostgreSQL con Docker

Servicio definido en `docker-compose.yml`: PostgreSQL 16 Alpine, puerto 5432.

| Parámetro | Valor |
|-----------|--------|
| Usuario / contraseña / BD | `user` / `password` / `quotation_config` |
| Conexión | `postgresql://user:password@localhost:5432/quotation_config` |
| Volumen | `quotation_config_pgdata` |

**Comandos:** `docker-compose up -d` | `docker-compose down` | `docker-compose down -v` (borra datos).

**Puerto 5432 ocupado:** Cambiar el mapeo en `docker-compose.yml` y el puerto en `DATABASE_URL` (`backend/.env`).
