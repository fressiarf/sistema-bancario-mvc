# Sistema Bancario Integral (Full-Stack MVC)

Este repositorio contiene la implementación completa de un sistema de gestión bancaria y financiera, desarrollado con un enfoque en seguridad, integridad de datos y experiencia de usuario.

---

## Estado del Proyecto: Fase de Integración

Actualmente, el proyecto ha superado la implementación del núcleo del Backend y se encuentra en fase de integración con el Frontend.

### Backend (Node.js + Express + Sequelize)
* **Seguridad Robusta**: Autenticación JWT con tokens firmados y expiración.
* **Protección de Datos**: Cifrado de contraseñas con Bcryptjs (Cost factor 10).
* **Control de Acceso (RBAC)**: Middlewares para autorizar acciones basadas en roles (Admin, Cajero, Cliente).
* **Base de Datos Relacional**: Modelos complejos con integridad referencial y auditoría integrada.

### Frontend (React + Vite)
* **Interfaz Moderna**: SPA rápida y responsiva en desarrollo.
* **Consumo de API**: Integración con los endpoints de seguridad y transacciones.
* **Estado Global**: Gestión centralizada de la sesión del usuario.

---

## Documentación Técnica

Para entender a profundidad la arquitectura, el modelo de datos y las reglas de negocio, consulta nuestro documento principal:

[Documento de Diseño y Análisis (Design Document)](./design_document.md)

---

## Guía de Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/fressiarf/sistema-bancario-mvc.git
cd sistema-bancario-mvc
```

### 2. Configuración del Backend
```bash
cd back_end
npm install
```
Configura tu archivo `.env` basándote en `.env.example` (o crea uno con los parámetros de DB y JWT).

Ejecuta las migraciones:
```bash
npm run migrate
```

### 3. Configuración del Frontend
```bash
cd ../front_end
npm install
npm run dev
```

---

## Evidencias de Desarrollo

Puedes revisar el archivo [**evidencia_migraciones.txt**](./back_end/evidencia_migraciones.txt) para validar la correcta ejecución del esquema de base de datos y la carga de los modelos de seguridad.

---

## Tecnologías Utilizadas
| Capa | Tecnologías |
| :--- | :--- |
| **Backend** | Node.js, Express, Sequelize, MySQL |
| **Frontend** | React, Vite, CSS Vanilla |
| **Seguridad** | JWT, Bcryptjs |
| **Herramientas** | Postman, Sequelize-CLI |

---
*Desarrollado por [fressiarf](https://github.com/fressiarf)*
