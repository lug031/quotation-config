# Frontend — Configuración de Cotización (Clientes) v2

Aplicación React para configurar parámetros de cotización por planta. Incluye el módulo **Costos indirectos** (márgenes por operación y rango de volumen).

## Stack

- **React** 18
- **Vite** (build y dev server)
- **Apollo Client** (GraphQL)
- **React Router** 7
- **TailwindCSS**

## Estructura

```
frontend/
├── src/
│   ├── main.tsx           # Entrada
│   ├── App.tsx            # Router y providers
│   ├── AppLayout.tsx       # Layout (barra + sidebar + contenido)
│   ├── routes.tsx         # Rutas y ítems del menú lateral
│   ├── graphql.ts         # Queries/mutations y VOLUME_RANGE_KEYS
│   ├── styles.css         # Estilos globales + Tailwind
│   ├── contexts/          # PlantsContext, SnackbarContext
│   ├── components/        # Snackbar y componentes compartidos
│   ├── pages/             # PlaceholderPage y otras vistas
│   └── features/
│       └── indirect-costs/   # Módulo Costos indirectos
├── .env.example
├── package.json
└── README.md
```

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar si hace falta. Con Vite, las variables expuestas al cliente deben tener el prefijo `VITE_`.

| Variable | Descripción |
|----------|-------------|
| `VITE_GRAPHQL_URL` | URL del API GraphQL (por defecto `http://localhost:4000`) |

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (Vite). Por defecto `http://localhost:5173` |
| `npm run build` | Compila TypeScript y genera build de producción |
| `npm run preview` | Sirve el build localmente para pruebas |

## Módulo Costos indirectos

La pantalla principal actual es la tabla de costos indirectos: operaciones por planta, columnas por rango de volumen (300 kg … 30T), celdas editables, paginación y alerta de margen ≤ 5 %.

Documentación detallada del módulo (estructura, hooks, flujo de datos): [src/features/indirect-costs/README.md](src/features/indirect-costs/README.md).

## Ejecución

Desde la raíz del repo, o desde `frontend/`:

```bash
npm install
npm run dev
```

El backend GraphQL debe estar corriendo (por defecto `http://localhost:4000`).
