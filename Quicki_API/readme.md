# Quicki API REST

Guía de uso y endpoints disponibles.

## Variables de entorno

Para ejecutar la API es necesario definir las siguientes variables de entorno en el archivo [/.env]

`PORT`

`FRONT_URI`

`JWT_SECRET`

## Despliegue

Clona el repositorio con Git e instala las dependencias:

```bash
  cd Quicki_API
  npm install
```

Modo desarrollador:

```bash
  npm run dev
```

Producción

```bash
  npm start
```

## Endpoints

### Autenticación y usuarios

#### Registro

```http
  POST /api/users/sign-up
```

| Parámetro     | Tipo de dato | Descripción     |
| :------------ | :----------- | :-------------- |
| `fullName`    | `string`     | **Obligatorio** |
| `email`       | `string`     | **Obligatorio** |
| `phoneNumber` | `string`     | **Obligatorio** |
| `password`    | `string`     | **Obligatorio** |

#### Inicio de sesión (Ambos)

```http
  POST /api/users/sign-in
```

| Parámetro  | Tipo de dato | Descripción     |
| :--------- | :----------- | :-------------- |
| `email`    | `string`     | **Obligatorio** |
| `password` | `string`     | **Obligatorio** |

⚠️ Requiere enviar el JWT en el encabezado de autorización.

### Perfil

#### Obtener tu perfil (Ambos)

```http
  GET /api/users/me
```

#### Actualizar perfil (Ambos)

```http
  PUT /api/users/sign-in
```

| Parámetro      | Tipo de dato | Descripción  |
| :------------- | :----------- | :----------- |
| `fullName`     | `string`     | **Opcional** |
| `email`        | `string`     | **Opcional** |
| `prevPassword` | `string`     | **Opcional** |
| `newPassword`  | `string`     | **Opcional** |

⚠️ Si se incluye newPassword, es obligatorio enviar también prevPassword.

#### Eliminar perfil (Ambos)

```http
  DELETE /api/users/me
```

### Ofertas de trabajo

#### Listar ofertas (Ambos)

```http
  GET /api/jobs
```

Trabajador → Todas disponibles.  
Empleador → Solo las propias.

#### Ver detalles de una oferta (Ambos)

```http
  GET /api/jobs/{:idJob}
```

#### Buscar una oferta de trabajo (Ambos)

```http
  GET /api/jobs/search/{:query}
```

⚠️ **query** puede ser tipo de trabajo, descripción, ubicación o salario.

#### Crear oferta (Empleador)

```http
  POST /api/jobs
```

| Parámetro     | Tipo de dato | Descripción     |
| :------------ | :----------- | :-------------- |
| `type`        | `string`     | **Obligatorio** |
| `description` | `string`     | **Obligatorio** |
| `location`    | `string`     | **Obligatorio** |
| `payment`     | `string`     | **Obligatorio** |

#### Actualizar oferta (Empleador)

```http
  PUT /api/jobs/{:idJob}
```

| Parámetro     | Tipo de dato | Descripción  |
| :------------ | :----------- | :----------- |
| `type`        | `string`     | **Opcional** |
| `description` | `string`     | **Opcional** |
| `location`    | `string`     | **Opcional** |
| `payment`     | `string`     | **Opcional** |

#### Eliminar oferta (Empleador)

```http
  DELETE /api/jobs/{:idJob}
```

### Aplicaciones a ofertas

#### Listar aplicaciones (Empleador)

```http
  GET /api/applications
```

#### Postularse a una oferta (Trabajador)

```http
  POST /api/applications/{:idJob}
```

#### Actualizar el estado de la aplicación (Empleador)

```http
  PUT /api/applications/{:idApplication}
```

| Parámetro      | Tipo de dato | Descripción                                                             |
| :------------- | :----------- | :---------------------------------------------------------------------- |
| `status`       | `string`     | **Obligatorio**. Valores **"pending"**, **"accepted"**, **"rejected"**. |
| `rejectOthers` | `boolean`    | **Opcional**. Rechaza las demás aplicaciones al aceptar una.            |
| `hiddenJob`    | `boolean`    | **Opcional**. Oculta la oferta de trabajo.                              |

## Autor

- [@RAH-013](https://www.github.com/RAH-013)
