# Costos indirectos (Configuración de Cotización)

Módulo de frontend para configurar márgenes por operación y rango de volumen por planta. Parte del flujo de **Configuración de Cotización (Clientes) v2**.

## Estructura

```
indirect-costs/
├── index.ts                 # Export público: IndirectCostsPage + tipos
├── IndirectCostsPage.tsx    # Pantalla principal (orquestación)
├── types.ts                 # Plant, Operation, Margin, OperationWithMargins
├── components/
│   ├── Sidebar.tsx           # Selector de planta + menú lateral
│   ├── IndirectCostsTable.tsx # Tabla operaciones × rangos de volumen
│   ├── TablePagination.tsx   # Controles paginación
│   ├── TableSkeleton.tsx     # Skeleton de carga de la tabla
│   └── cells/
│       ├── OperationNameCell.tsx
│       ├── OperationDescriptionCell.tsx
│       └── MarginCell.tsx
├── hooks/
│   ├── usePlants.ts              # GET_PLANTS + selección de planta
│   ├── useOperationsWithMargins.ts # GET_OPERATIONS_WITH_MARGINS_BY_PLANT
│   ├── useMarginEditing.ts      # Borradores y guardado de márgenes
│   └── useOperationEditing.ts   # CRUD operación (nombre/descripción, nueva fila)
└── utils/
    ├── cellKey.ts               # Clave celda (plantId, operationId, volumeRange)
    └── formatVolumeHeader.ts    # Etiqueta de columna por VolumeRangeKey
```

## Uso

```tsx
import { IndirectCostsPage } from "./features/indirect-costs";

function App() {
  return <IndirectCostsPage />;
}
```

## Flujo de datos

- **Plantas:** `usePlants()` → lista de plantas y `plantId` seleccionado.
- **Operaciones y márgenes:** `useOperationsWithMargins(plantId, page, pageSize, onlyWithMargins)` → filas de la página actual y totalCount (paginación en servidor; `onlyWithMargins` filtra en backend solo operaciones con al menos un margen guardado para la planta).
- **Edición de márgenes:** `useMarginEditing(plantId, rows, { onSaveError, onSaveSuccess, refetch, getOperationsQueryVariables })` → drafts, validación (5–100 %), `commitCell` → mutation `saveOperationMargins`. Si se pasa `getOperationsQueryVariables`, la mutación usa `refetchQueries` para actualizar el totalCount del filtro en tiempo real.
- **Edición de operaciones:** `useOperationEditing({ plantId, onSaveError })` → edición inline nombre/descripción y fila “+ Agregar operación” → mutations `createOperation` / `updateOperation`.

**Filtro por operaciones con márgenes:** Un toggle envía `onlyWithMargins` a la query; el filtro se aplica en el backend (paginación y totalCount correctos). Tras guardar un margen, `refetchQueries` con `getOperationsQueryVariables` actualiza el conteo sin refrescar.

**Tabla:** Columnas Operación, Descripción y rangos de volumen. Orden por nombre (asc) en backend.

## Reglas de negocio (UI)

Márgen 5–100 %; alerta si ≤ 5 %. Nombre de operación obligatorio. Refetch / refetchQueries tras guardar. Paginación: 10, 25, 30 o 50 por página; controles primera/anterior/siguiente/última.
