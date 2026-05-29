# NaturaVida 
NaturaVida es una aplicación de tienda virtual enfocada en la 
comercialización de productos naturales, orgánicos y saludables.
El sistema está diseñado para ofrecer una experiencia de usuario fluida en la navegación y compra de productos, facilitando la 
gestión tanto para los clientes como para los administradores de la plataforma. 
## Características Principales 
* **Catálogo de Productos:** Visualización detallada de productos 
organizados por categorías (suplementos, alimentos orgánicos, cosmética natural, etc.).
* **Carrito de Compras:** Gestión dinámica de productos, cálculo de totales e impuestos en 
tiempo real.
* **Gestión de Usuarios:** Registro, inicio de sesión y perfiles de usuario con 
historial de compras.
* **Persistencia Local Simulada:** Gestión completa de operaciones 
CRUD para productos, usuarios y pedidos.
## Arquitectura y Tecnologías 
El proyecto está desarrollado utilizando una arquitectura frontend moderna conectada a una API REST simulada 
para el desarrollo ágil: 
* **Frontend:** Desarrollado con Angular, aprovechando su sistema de 
componentes, servicios para la lógica de negocio y enrutamiento modular.
* **Backend 
(Simulado):** Configurado mediante JSON Server, que proporciona una API REST completa y 
operaciones CRUD a partir de un archivo de origen en formato JSON.
## Requisitos Previos 
Para ejecutar este proyecto de forma local, asegúrese de tener instalado: 
* Node.js (Versión 
LTS recomendada)
* Angular CLI (Instalado de forma global mediante `npm install -g 
@angular/cli`)
* Un entorno de desarrollo (IDE) como VS Code o similar
## Configuración e Instalación
### Servidor de Datos (JSON Server)
1. Navegue al directorio del servidor o donde 
se encuentre el archivo de base de datos simulada: ```bash cd naturavida-app/backend ```
2. Instale JSON Server de forma local si no lo ha hecho previamente: ```bash npm install 
json-server ```
3. Inicie el servidor simulado (por defecto en el puerto 3000): ```bash npx 
json-server --watch db.json ```
### Frontend (Angular) 
1. Navegue al directorio de la aplicación 
frontend: ```bash cd naturavida-app/frontend ```
2. Instale las dependencias del proyecto: 
```bash npm install ```
3. Inicie el servidor de desarrollo de Angular: ```bash ng serve ```
4. Abra su navegador web e ingrese a la dirección `http://localhost:4200/`.
## Estructura del Repositorio 
* `/src/app`: Componentes, servicios, guardas y módulos principales de la aplicación Angular.
* `/src/assets`: Archivos estáticos, imágenes de productos y configuraciones globales.
* `/backend`: Archivo `db.json` que actúa como la base de datos del proyecto y configuraciones 
de las rutas de JSON Server.
## Contribuciones 
1. Realice un Fork del repositorio.
2. Cree una nueva rama para su funcionalidad: `git checkout -b feature/NuevaFuncionalidad`.
3. Realice sus cambios y haga un commit: `git commit -m 'Añadir nueva funcionalidad'`.
4. Suba los cambios a su rama: `git push origin feature/NuevaFuncionalidad`.
5. Abra un Pull Request detallando los cambios realizados.
