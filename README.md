<h3 align="center"> Una vez que se descargue el archivo: </h3>

<p style="display: flex; align-items: center; text-align: left;"> 1. Abrir la Terminal y ejecutar el comando: npm install </p>

<p style="display: flex; align-items: center; text-align: left;"> 2. Debe tener una cuenta en <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/> BD ATLAS </p>

<p style="display: flex; align-items: center; text-align: left;"> 3. En el dashbord de MONGO DB ATLAS, crear un Projecto </p>

<img alt="image" src="./assets/img/Captura de pantalla 2025-05-11 221951.png" height="350" width="340">

<p style="display: flex; align-items: center; text-align: left;"> 4. En la siguiente ventana, agregamos miembros y permisos de ser necesario y clickeamos el boton Create Project </p>

<img alt="image" src="./assets/img/Captura de pantalla 2025-05-11 225238.png" height="350" width="340">

<p style="display: flex; align-items: center; text-align: left;"> 5. Seleccionamos el tipo de membrsia, y configuramos nombre y servidor, luego hacemos clic en Create Deployment</p>

<img alt="image" src="./assets/img/Captura de pantalla 2025-05-11 230117.png" height="350" width="340">
<img alt="image" src="./assets/img/Captura de pantalla 2025-05-11 230128.png" height="350" width="340">

<p style="display: flex; align-items: center; text-align: left;"> 6. Nos devolvera unas credenciales las cuales guardaremos en un archivo .env</p>

<img alt="image" src="./assets/img/Captura de pantalla 2025-05-11 230700.png" height="350" width="340">

<p style="display: flex; align-items: center; text-align: left;"> 7. Damos click en Choose a connection method y seleccionamos la opcion de Compass.

<img alt="image" src="./assets/img/Captura de pantalla 2025-05-11 232633.png" height="350" width="340">

<p style="display: flex; align-items: center; text-align: left;"> 8. Una vez seleccionado, nos mostrara un link de compass y copiamos el link.</p>

<img alt="image" src="./assets/img/Captura de pantalla 2025-05-11 233435.png" height="350" width="340">

<p style="display: flex; align-items: center; text-align: left;"> 9. En la aplicacion de Mongo BD Compass, en #CONNECTIONS, dacemos click en "+", pegamos la URL del punto anterior y hacemos click en Save & Connect.</p>

<img alt="image" src="./assets/img/Captura de pantalla 2025-05-11 233728.png" height="350" width="340">

<p style="display: flex; align-items: center; text-align: left;"> 10. Dentro del archivo .env se deben colocar las variables de entorno: </p>

PORT = N° de puerto <br>
DB_USER= Nombre de usuario<br>
DB_PASSWORD= Contraseña<br>
DB_NAME= Nombre de la base de datos<br>
DB_CLUSTER= Nombre del cluster