# CBD-marmarsol4-ismbargar

Desarrollado por: 
- Ismael Barrera García
- María Márquez Soldán

## Manual de instalación

- Descargar el zip del código del repositorio.
- Tener MongoDB en ejecución. Si no se hubiese instalado como servicio, deberá ejecutar el servicio mediante mongod.exe, cuyo ejecutable se encuentra en la carpeta bin. Para facilitar la tarea y en caso de encontrarse en Windows, recomendamos añadir esta carpeta a la variable de entorno path para poder ejecutar el comando mongod directamente en una terminal desde cualquier ruta.
- Ejecución de backend: en una terminal que se encuentre en la ruta base del proyecto, cd backend, npm install y luego npm run dev. El servidor se ejecutará en localhost en el puerto 3000. 
- Ejecución de frontend: En otra terminal, cd frontend, npm install, y finalmente npm run dev. La aplicación se ejecutará en localhost en el puesto 5173. 

Nota: Los npm install sólo son necesarios la primera vez que se vaya a ejecutar la aplicación, para instalar todas las dependencias. 

## Manual de usuario

Con la aplicación ejecutándose, accedemos a http://localhost:5173. La primera pantalla a que se accede es la del login, donde ya se permite alternar el modo de la aplicación entre MongoDB y Mongoose. Esto se aplicará al resto de pantallas de la aplicación. 

![Captura de pantalla 2024-04-27 211418](https://github.com/marmarsol4/CBD-marmarsol4-ismbargar/assets/72874394/b9091ac9-04e8-46f2-af89-d2586217893f)

Para acceder, introducir unas credenciales registradas en la DB, dado que el usuario partirá de una base de datos vacía, proceder al registro mediante el botón “Regístrate”. En la pantalla de registro también se podrá cambiar el modo en el que funciona la aplicación.

![Captura de pantalla 2024-04-27 211723](https://github.com/marmarsol4/CBD-marmarsol4-ismbargar/assets/72874394/2d0cf639-bed8-47b5-85ca-158edfcd07b9)

En ella registrar unos datos válidos acorde a la política definida por el equipo:
- Nombre de usuario: Entre 4-16 caracteres, con únicamente letras, números y guiones bajos.
- Contraseña: De mínimo 12 caracteres, conteniendo una minúscula, una mayúscula, un número y un carácter especial. Una contraseña de ejemplo válida es: 12345678910aA@. Hay una confirmación de contraseña, donde ambos campos deben coincidir. 
- Email: Un email válido. 

Si el registro es exitoso se mostrará un mensaje de éxito y se redirigirá a login, donde ya se puede iniciar sesión con el usuario creado.  

![Captura de pantalla 2024-04-27 212445](https://github.com/marmarsol4/CBD-marmarsol4-ismbargar/assets/72874394/17c9a004-2134-4556-8562-a870086f923b)

Si por el contrario ha habido errores en el registro, se informará de dichos errores mediante un mensaje y se mostrarán hasta que el usuario los corrija y vuelva a hacer una petición. 

![Captura de pantalla 2024-04-27 212818](https://github.com/marmarsol4/CBD-marmarsol4-ismbargar/assets/72874394/eb36d9a5-2311-4922-a662-c24eb29c65af)

Tras el inicio de sesión exitoso, se redirigirá a la pantalla de gestión de archivos. Sobre ella se puede cambiar el modo, subir archivos y hacer logout. Para subir un archivo sólo hay que darle al botón con un + y seleccionar el archivo.

![Captura de pantalla 2024-04-27 213110](https://github.com/marmarsol4/CBD-marmarsol4-ismbargar/assets/72874394/ebd4341f-ddf9-4136-a41c-d2535450ad5d)

Cuando se suban archivos, la pantalla tendrá el aspecto de la figura posterior. Si el usuario tiene compartidos archivos de otros usuarios, también aparecerán en el listado. Hay iconos personalizados para los archivos xls, docx, pdf, pptx. Si el archivo tuviese otra extensión, se le asignaría un icono genérico.  

![Captura de pantalla 2024-04-27 213618](https://github.com/marmarsol4/CBD-marmarsol4-ismbargar/assets/72874394/0ca3f87e-9c62-4a8b-b575-02620546c13c)

El usuario puede ver los detalles de los archivos haciendo click sobre ellos, de forma que se abrirá una barra lateral con la información del mismo y botones para realizar operaciones sobre él.

- El primer botón es para compartir el documento con otros usuarios y establecer sus permisos.
- El segundo botón es para descargar el archivo. 
- El tercer archivo es para poner en favoritos del usuario el archivo. Por defecto, los archivos en favorito aparecerán al principio del listado, tal y como se muestra en la figura posterior. 
- El último botón es para borrar el archivo, pasando por una pantalla de confirmación.   

Para cerrar la barra lateral bastará con hacer click fuera del espacio que ocupa la barra. 

![Captura de pantalla 2024-04-27 213939](https://github.com/marmarsol4/CBD-marmarsol4-ismbargar/assets/72874394/232936d8-75ca-441a-ac0a-ba5d9952101d)

Cuando se pulse sobre compartir aparecerá el siguiente modal, donde aparecerá por defecto el permiso de vista seleccionado:

![Captura de pantalla 2024-04-27 214916](https://github.com/marmarsol4/CBD-marmarsol4-ismbargar/assets/72874394/9aaa2db2-b3db-4ac5-a47c-09ea769a496f)

Se pueden añadir tantos usuarios como se desee con los permisos del selector. Una vez añadidos los usuarios, se verán en un listado dentro del modal de compartir. 
- Para quitar al usuario basta con hacer click sobre la cruz roja del listado. 
- Si por el contrario se quisiese editar los permisos del usuario, sólo hay que introducir su nombre de usuario de nuevo y el nuevo permiso en el selector. 
Si se introdujese un usuario que no existiese en la base de datos, el sistema lo informará mediante un mensaje.

![Captura de pantalla 2024-04-27 220706](https://github.com/marmarsol4/CBD-marmarsol4-ismbargar/assets/72874394/b1aae8eb-885a-47b4-9945-7c1d6fe813fd)

Los detalles que tendrán los usuarios con permisos de vista, lectura y escritura quedan reflejados en las 3 figuras posteriores, respectivamente. Los que tengan permiso de vista pueden ver el archivo en su listado. Con lectura pueden verlo en su listado y descargarlo y con escritura pueden verlo en su listado, descargar y eliminar el archivo.  

![Captura de pantalla 2024-04-27 220348](https://github.com/marmarsol4/CBD-marmarsol4-ismbargar/assets/72874394/9e6f2c64-22b2-4dda-ae5d-dbe9a10da5da)
![Captura de pantalla 2024-04-27 220431](https://github.com/marmarsol4/CBD-marmarsol4-ismbargar/assets/72874394/1dacdc0c-0215-44fc-8fd6-28bb3a71d4c6)
![Captura de pantalla 2024-04-27 220737](https://github.com/marmarsol4/CBD-marmarsol4-ismbargar/assets/72874394/5187e9f7-b77d-4a73-b7f2-9e70088bcc9e)
