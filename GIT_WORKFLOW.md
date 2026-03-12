# Flujo de trabajo Git

## Convención de branching

Normalmente trabajo con una estrategia de ramas donde las principales son `main` y `develop`.

- **main:** contiene el código estable que está en producción.
- **develop:** es la rama donde se integran los cambios de desarrollo antes de pasar a producción.

A partir de estas ramas se crean otras según el tipo de trabajo:

- **feature/...** para nuevas funcionalidades
- **bugfix/...** para corrección de errores
- **hotfix/...** para arreglos urgentes en producción
- **release/...** para preparar una versión antes de pasar a producción

En algunos proyectos también he trabajado con una rama intermedia como `staging` o `draft-develop`, que sirve para validar cambios antes de que lleguen a producción.

En este proyecto además se configuró **Husky** para reforzar estas convenciones. Antes de permitir un commit se ejecuta un hook `pre-commit` que valida que el nombre de la rama siga el formato esperado (`main`, `develop` o bien `feature/...`, `bugfix/...`, `hotfix/...`, `release/...`). Si la rama no cumple esa convención, el commit se bloquea.

## Convención de commits

Para los commits normalmente usamos **Conventional Commits**, con el formato:

```
tipo(alcance): descripción
```

Los tipos más comunes que usamos son:

- **feat** → nuevas funcionalidades
- **fix** → corrección de errores
- **docs** → cambios en documentación
- **chore** → tareas de mantenimiento o configuración

El alcance es opcional, pero ayuda cuando el cambio afecta una parte específica del sistema. Por ejemplo:

```
feat(indirect-costs): agregar paginación
```

También se utiliza **Commitlint** para validar automáticamente los mensajes de commit. Esto se ejecuta mediante un hook `commit-msg` de Husky, que verifica que el mensaje siga el formato de Conventional Commits. Si el mensaje no cumple con las reglas definidas, el commit se rechaza y se debe corregir.

Esto asegura que tanto la convención de ramas como la de commits se validen de forma automática antes de que los cambios entren al repositorio.

## Cómo mantengo mi branch actualizado con main

En la práctica, las ramas normalmente se crean desde Bitbucket o GitHub, muchas veces asociadas a un ticket de Jira.

En el flujo que suelo usar, los features se crean desde `develop`, porque ahí se integran todos los cambios de desarrollo.

Mientras estoy trabajando en mi rama, si otros desarrolladores hacen merges a `develop`, lo que hago es traer esos cambios para evitar conflictos grandes al final. Algo típico sería:

```bash
git checkout develop
git pull origin develop
git checkout feature/margins
git merge develop
```

Cuando el desarrollo está listo, se crea un Pull Request hacia `develop` para revisión.

Después, cuando se prepara una salida a producción, normalmente se crea una rama `release`. Esa rama nace de `main` y se integran ahí los cambios que ya están en `develop`. Finalmente se hace un PR de `release` a `main`.

De esa forma `main` siempre se mantiene estable y actualizado solo con cambios que ya pasaron por desarrollo y pruebas.

## Manejo de cambios en el schema con Prisma

En proyectos donde el esquema está relacionado con Prisma, seguimos un flujo para evitar inconsistencias entre desarrolladores.

**Antes de modificar el schema:**

```bash
npx prisma db pull
npx prisma generate
```

Esto asegura que el desarrollador tiene el estado más reciente de la base de datos.

Luego se hacen los cambios en `schema.prisma`.

**Después se aplican:**

```bash
npx prisma db push
```

o, en entornos más controlados, mediante migraciones (`prisma migrate`), que es lo más recomendable cuando el equipo es grande.

De esta forma, cuando otro desarrollador actualiza su rama puede traer esos cambios con `prisma db pull` y mantenerse sincronizado con la base de datos.

## Cómo manejaría un conflicto si otro desarrollador edita el mismo schema.graphql

Si dos desarrolladores modifican el mismo archivo del schema, lo primero que hago es traer los últimos cambios de la rama base antes de abrir el PR, para ver si aparece el conflicto localmente.

Si aparece, reviso qué cambió cada rama. En este tipo de archivos normalmente el conflicto ocurre porque alguien agregó nuevos tipos, inputs o campos. Lo que hago es revisar ambos cambios y combinarlos de forma que el schema final quede consistente.

Después de resolverlo, verifico que el backend siga funcionando correctamente, porque cuando cambia el schema muchas veces también hay que revisar los resolvers o cualquier lógica asociada.

Una vez validado que todo compila y funciona, se hace el commit con la resolución del conflicto y se continúa con el flujo normal del PR.
