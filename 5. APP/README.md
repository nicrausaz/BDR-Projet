# Projet BDR - Installation
> Nicolas Crausaz et Maxime Scharwath

Le serveur de notre application est un serveur codé en NodeJS avec le Framework TSED qui nous a facilite la vie pour la création d'un serveur API REST. Nous avons séparé la gestion de nos tables en contrôleurs. Qui sont eux aussi séparés en sous requêtes avec leurs fonctions dédiées.

Le frontend est une application Vue.js

> ! Vous devez avoir installé NodeJS sur votre ordinateur https://nodejs.org/en/ !


## Database

Il faut utiliser PostgreSQL.

Importer la DB et les données à l'aide du script fourni.

Utiliser pour l'application le compte:

> bdruser password

<br>

## Installation [Backend]
```batch
$ cd ./backend

$ npm install

$ npm start
```

Le serveur va démarrer normalement sur http://localhost:8083 

Les réglages du serveur se trouvent dans le fichier _.env_ à la racine du dossier backend,
il faut y éditer les informations de connexion à la DB.

<br>

## Installation [Frontend]

```batch
$ cd ./frontend

$ npm install

$ npm run serve
```

Le frontend est maintenant démarré sur http://localhost:8080

---
<div style="text-align: right"> Nicolas Crausaz et Maxime Scharwath - 20.01.2020</div>