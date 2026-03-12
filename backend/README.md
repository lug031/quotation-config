# Backend — Configuración de Cotización (Clientes) v2

API GraphQL para gestionar plantas, operaciones y márgenes por planta/operación/rango de volumen. Pensado para el módulo de frontend **Costos indirectos**.

## Stack

- **Node.js** ≥ 20
- **Apollo Server 4** (GraphQL)
- **Prisma** (PostgreSQL)
- **TypeScript** (tsx en desarrollo)

## Estructura del código

```
backend/
├── prisma/
│   ├── schema.prisma       # Modelo: Plant, Operation, PlantOperationMargin
│   └── migrations/
├── src/
│   ├── index.ts            # Entrada: Apollo Server en modo standalone
│   ├── graphql/
│   │   ├── schema.ts       # TypeDefs GraphQL (queries, mutations, tipos)
│   │   └── resolvers.ts    # Resolvers (delegan a domain/useCases)
│   ├── domain/
│   │   ├── useCases.ts     # Casos de uso
│   │   ├── errors.ts       # ValidationError y otros
│   │   ├── constants.ts    # Umbral alerta margen (5 %), DEFAULT_QUERY_LIMIT (50), VOLUME_RANGE_KEYS
│   │   └── repositories.ts # Interfaces de repositorios
│   └── infra/
│       └── prisma/         # Implementación Prisma de los repositorios
├── .env.example
├── Dockerfile              # Imagen para Docker Compose
├── .dockerignore
└── README.md
```

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar. Migraciones: `npm run prisma:migrate` en `backend/`.

| Variable       | Descripción |
|----------------|-------------|
| `PORT`         | Puerto del servidor |
| `DATABASE_URL` | Conexión PostgreSQL (ver raíz del repo y `docker-compose.yml`) |

## Scripts

| Comando              | Descripción |
|----------------------|------------|
| `npm run dev`        | Desarrollo (tsx watch). Endpoint: `http://localhost:4000` |
| `npm run build`      | Genera Prisma Client y compila TypeScript a `dist/` |
| `npm start`          | Ejecuta `dist/index.js` (producción) |
| `npm run prisma:generate` | Solo `prisma generate` |
| `npm run prisma:migrate`  | Migraciones de desarrollo (`prisma migrate dev`) |
| `npm run prisma:studio`   | Abre Prisma Studio para la base de datos |

## API GraphQL

- **Endpoint:** `http://localhost:4000`

### Queries

| Query | Descripción |
|-------|-------------|
| `plants` | Lista todas las plantas |
| `plant(id: ID!)` | Planta por id |
| `operations` | Lista todas las operaciones |
| `operation(id: ID!)` | Operación por id |
| `operationsWithMarginsByPlant(plantId: ID!, limit: Int, offset: Int, onlyWithMargins: Boolean)` | Operaciones con márgenes por planta (paginado). Devuelve `{ items, totalCount }`. Si `onlyWithMargins: true`, solo operaciones que tienen al menos un margen guardado para esa planta. Por defecto limit 50, offset 0. |

### Mutations

| Mutation | Descripción |
|----------|-------------|
| `createPlant(input: CreatePlantInput!)` | Crea planta |
| `createOperation(input: CreateOperationInput!)` | Crea operación |
| `updateOperation(id: ID!, input: UpdateOperationInput!)` | Actualiza operación |
| `saveOperationMargins(plantId: ID!, operationId: ID!, margins: [MarginInput!]!)` | Guarda márgenes por rango (validación 5–100 %) |

### Tipos principales

- **Plant:** id, name, code  
- **Operation:** id, name, description  
- **PlantOperationMargin:** id, plantId, operationId, volumeRange (enum), marginPercent, hasLowMarginAlert (calculado: ≤ 5 %)  
- **OperationWithMargins:** operation + margins[] (para una planta dada)
- **OperationsWithMarginsByPlantResult:** items (lista de OperationWithMargins), totalCount (Int)

Rangos de volumen: `VOLUME_300KG`, `VOLUME_500KG`, `VOLUME_1T`, `VOLUME_3T`, `VOLUME_5T`, `VOLUME_10T`, `VOLUME_20T`, `VOLUME_30T`.

## Modelo de datos (Prisma)

- **Plant**: nombre, code opcional; 1-N con `PlantOperationMargin`.
- **Operation**: nombre, description opcional; 1-N con `PlantOperationMargin`.
- **PlantOperationMargin**: (plantId, operationId, volumeRange) único; marginPercent Decimal(5,2); cascade on delete.

Esquema: `prisma/schema.prisma`. Entidades: [docs/ENTITY_RELATIONSHIPS.md](../docs/ENTITY_RELATIONSHIPS.md).

## Docker

```bash
docker compose up -d
```

API: `http://localhost:4000`.
