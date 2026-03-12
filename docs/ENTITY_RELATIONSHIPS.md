# Relaciones entre entidades

**Plant:** Planta/sede. Campos: `id`, `name`, `code?`, timestamps. 1:N con `PlantOperationMargin`.

**Operation:** Operación. Campos: `id`, `name`, `description?`, timestamps. 1:N con `PlantOperationMargin`.

**VolumeRangeKey:** Enum con 8 rangos: 300 kg, 500 kg, 1T, 3T, 5T, 10T, 20T, 30T.

**PlantOperationMargin:** Margen (%) por planta × operación × rango. Campos: `plantId`, `operationId`, `volumeRange`, `marginPercent`. Única `(plantId, operationId, volumeRange)`. FK a Plant y Operation con `onDelete: Cascade`.

```
Plant (1) ─── (*) PlantOperationMargin (*) ─── (1) Operation
                        volumeRange, marginPercent
```

Cada celda de la tabla UI corresponde a una fila de `PlantOperationMargin`. Alerta si `marginPercent` ≤ 5%.
