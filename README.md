AuthJS
======

Es un módulo para proyectos en Node.js que permite definir ciertas URL que requieren de un usuario y contraseña. También ayuda a gestionar sesiones de los usuarios.

Tecnologías
-----------

Como lenguaje se tomó node.js y motor de base de mongodb para la gestión de base de datos.

Requerimientos
--------------

-	express
-	jade
-	monk
-	fs
-	cookie-parser

### Instalación rapida

```
npm install express jade monk fs cookie-parser
```

----------------------------------------------------

Instalando modulo
-----------------

Lo primer es descargar el paquete desde github

```
git clone https://github.com/alfa30/AuthJS.git
```

Para utilizar el modulo se requiere primero instalar los paquetes que este exige

```
npm install express jade monk fs cookie-parser
```

Luego en el proyecto se debe de hacer la instancia hacia el objeto Auth

```
var auth = require(“./auth.js”);
```

Auth.reg
--------

Este método permite proteger una url y exige en la aplicación iniciar sesión.

```
Auth.reg(“/app”);
```

Auth.use
--------

Este método instala y remplaza objetos dentro de auth como el objeto de la base de datos permitiendo definir la base de datos a ocupar

Auth.use(“monk”,db)
-------------------

Remplaza y define la base de datos a ocupar

```
Auth.use(“monk”,db);
```

Donde ‘db’ es el objeto monk definido anteriormente. ‘require(“monk”)’

Auth.use(“express”)
-------------------

Remplaza el objeto express y así no tiene problemas para intervenir en la aplicación con express. 

```
Auth.use(“express”,app);
```

Donde ‘app’ es el objeto ‘express()’ definido anteriormente ‘require(“express”)’

----------------------------------------------------

Licencia
--------

![Img](http://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)

AuthJS por [Jonathan Delgado Zamorano](http://jonad.in/) se distribuye bajo una [Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional](http://creativecommons.org/licenses/by-nc-sa/4.0/). Basada en una obra en [https://github.com/alfa30/AuthJS](https://github.com/alfa30/AuthJS)

Esta obra está licenciada bajo la Licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional. Para ver una copia de esta licencia, visita [LICENSE.txt](https://raw.github.com/alfa30/AuthJS/master/LICENSE.txt).
