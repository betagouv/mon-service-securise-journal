# Journal de MonServiceSécurisé

Ce dépôt Git représente le journal des événements métiers 
survenus dans [MonServiceSécurisé](https://github.com/betagouv/mon-service-securise).

Ces événements métiers ont vocation à être utilisés par la 
partie _reporting_ de MonServiceSécurisé.

## Configuration de l'environnement de développement

Il est nécessaire en prérequis d'avoir installé [Git](https://git-scm.com/),
[Docker](https://www.docker.com/) et [Node.js v16](https://nodejs.org/en/).

Commencer par récupérer les sources du projet et aller dans le répertoire créé.

```sh
$ git clone https://github.com/betagouv/mon-service-securise-journal.git && cd mon-service-securise-journal
```

### Créer la base de données de MonServiceSécurisé-Journal

Lancer le conteneur de base de données puis y créer une base de données `mss-journal` et un utilisateur `metabase` 
qui sera utilisé par Metabase.

La base de données `mss-journal` sert :
 - à stocker les événements métiers de MonServiceSécurisé
 - comme base de données de travail de Metabase

```sh
$ docker compose up db
$ docker exec -t mon-service-securise-journal-db-1 createdb -U postgres mss-journal
$ docker exec -t mon-service-securise-journal-db-1 createuser -U postgres metabase
```



### Créer le schéma nécessaire à MonServiceSécurisé-Journal
```sh
$ docker exec -t mon-service-securise-journal-db-1 psql -U postgres -c 'CREATE SCHEMA journal_mss
    CREATE TABLE evenements ( 
        id UUID primary key, 
        date date, 
        type varchar, 
        donnees json 
      );'
```

### Donner les droits à l'utilisateur metabase

```sh
$ docker exec -t mon-service-securise-journal-db-1 psql -U postgres -c 'GRANT USAGE ON SCHEMA journal_mss TO metabase;'
$ docker exec -t mon-service-securise-journal-db-1 psql -U postgres -c 'GRANT SELECT ON ALL TABLES IN SCHEMA journal_mss TO metabase;'
```





### Configurer Metabase

Arrivé ici, vous pouvez démarrer Metabase et le configurer :

```sh
$ ./scripts/start.sh
```



Créer un fichier `.env` à partir du fichier `.env.template` et renseigner les diverses variables d'environnement.

Lancer le script `scripts/start.sh`

Se connecter au conteneur de la base de données et créer une nouvelle base `mss-journal` pour un utilisateur postgres.


Exécuter les migrations depuis le conteneur du serveur web.

```sh
$ docker exec -t mon-service-securise_web_1 npx knex migrate:latest
```
