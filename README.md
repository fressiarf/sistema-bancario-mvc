# Sistema Bancario MVC - Backend

Este proyecto es la primera fase del backend para un sistema de servicios bancarios y financieros. Está desarrollado en Node.js utilizando **Sequelize (ORM)** para la gestión de la base de datos relacional (MySQL).

## Estado del Proyecto (Fase 1)

Actualmente, el proyecto cumple con la estructura base de datos y arquitectura, lo cual incluye:
- Modelos Sequelize definidos y documentados.
- Migraciones configuradas y validadas.
- Relaciones y asociaciones (1:N, N:M, auto-referenciales) establecidas.
- Controladores y Rutas (Planeados para la próxima fase).

## Documentación Técnica

Para entender a profundidad la estructura de la base de datos, las entidades, relaciones y restricciones de integridad que rigen el núcleo financiero de esta aplicación, por favor revisa nuestro documento de diseño:

[Leer el Documento de Diseño (Design Document)](./back_end/design_document.md)

## Guía de Instalación y Uso

Si deseas clonar y ejecutar la estructura de este proyecto en tu entorno local, sigue estos pasos:

### 1. Clonar e Instalar dependencias
```bash
git clone https://github.com/fressiarf/sistema-bancario-mvc.git
cd sistema-bancario-mvc/back_end
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la carpeta `back_end/` basándote en la siguiente estructura:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sistema_bancario_mvc
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_password_mysql
NODE_ENV=development
```

### 3. Ejecutar Migraciones
Una vez configurada tu base de datos local, ejecuta el siguiente comando para generar todas las tablas y relaciones automáticamente:
```bash
npm run migrate
```
*(Nota: Puedes revisar el archivo `evidencia_migraciones.txt` para validar cómo se ve una ejecución exitosa de este comando).*

## Tecnologías Utilizadas
* **Entorno:** Node.js
* **Base de Datos:** MySQL
* **ORM:** Sequelize & Sequelize-CLI
