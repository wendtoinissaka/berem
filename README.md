# BEREM WEB SITE

Application web de présentation et de gestion des activités de **BEREM**, développée avec Next.js, Prisma et MySQL.

Le projet permet de présenter l'entreprise, ses services, ses réalisations et ses activités, tout en proposant un espace d'administration pour gérer les contenus et les demandes des visiteurs.

## Technologies utilisées

- **Next.js** : framework web.
- **React** : interface utilisateur.
- **TypeScript** : typage statique.
- **Tailwind CSS** : styles et mise en page.
- **Prisma ORM** : gestion de la base de données.
- **MySQL 8.4** : système de gestion de base de données.
- **Docker** : conteneurisation de l'application et de la base de données.
- **Docker Compose** : orchestration des services.
- **pnpm** : gestionnaire de dépendances.

## Prérequis

Pour travailler sur le projet, il faut disposer de :

- Node.js 22 ou supérieur.
- pnpm 10 ou supérieur.
- MySQL 8.4, ou Docker Engine avec Docker Compose.

## Installation et configuration

### 1. Récupérer le projet

```bash
git clone https://github.com/wendtoinissaka/berem.git
cd berem
```

### 2. Installer les dépendances

```bash
pnpm install
```

La génération du client Prisma est exécutée automatiquement lors de l'installation.

### 3. Configurer les variables d'environnement

Copiez le fichier d'exemple :

```bash
cp .env.example .env
```

Renseignez les variables nécessaires au fonctionnement de l'application, notamment :

- `DATABASE_URL` : URL de connexion à la base MySQL.
- Les paramètres SMTP pour l'envoi des emails.
- Les identifiants Cloudinary pour la gestion des médias.
- Les secrets nécessaires à l'authentification et à la sécurité.
- Les URL de l'application.

Ne partagez jamais votre fichier `.env` et ne le versionnez pas dans Git.

## Base de données et Prisma

Le projet utilise MySQL avec Prisma ORM.

### Commandes disponibles

| Commande | Description |
|---|---|
| `pnpm db:generate` | Génère le client Prisma. |
| `pnpm db:migrate` | Crée et applique une migration en développement. |
| `pnpm db:deploy` | Applique les migrations existantes. |
| `pnpm db:studio` | Ouvre Prisma Studio. |

### Créer une migration

Après avoir modifié les modèles dans `prisma/schema.prisma`, créez une migration :

```bash
pnpm prisma migrate dev --name nom_de_la_migration
```

En production, les migrations existantes doivent être appliquées avec :

```bash
pnpm db:deploy
```

Le dossier `prisma/migrations/` doit être présent dans le dépôt Git afin de conserver l'historique des migrations.

### Utilisation du client Prisma

Importez le client Prisma côté serveur :

```typescript
import { prisma } from "@/lib/prisma";
```

## Développement

Lancez le serveur de développement :

```bash
pnpm dev
```

L'application est accessible à l'adresse :

http://localhost:3000

Pour vérifier les erreurs TypeScript :

```bash
pnpm exec tsc --noEmit
```

## Exécution avec Docker

Le projet dispose d'une configuration Docker Compose permettant de démarrer automatiquement :

- le serveur MySQL ;
- le service de migration et d'initialisation de l'administrateur ;
- l'application Next.js.

### 1. Prérequis

- Docker Engine ou Docker Desktop.
- Docker Compose.

### 2. Configurer l'environnement Docker

Un fichier `.env.docker.example` est fourni à la racine du projet.

Copiez-le pour créer votre propre fichier de configuration :

```bash
cp .env.docker.example .env.docker
```

Ouvrez ensuite `.env.docker` et renseignez les valeurs adaptées à votre environnement.

Ce fichier contient notamment les paramètres nécessaires à la configuration de MySQL, à la connexion de l'application à la base de données, à l'authentification, aux emails et aux autres services utilisés par le projet.

**Important :**

- Ne modifiez pas le fichier `.env.docker.example` pour y enregistrer vos secrets personnels.
- Ne partagez jamais votre fichier `.env.docker`.
- Ne versionnez jamais `.env.docker` dans Git.
- Utilisez des mots de passe et des secrets robustes, particulièrement en production.

### 3. Démarrer les conteneurs

À la racine du projet, exécutez :

```bash
docker compose --env-file .env.docker up -d --build
```

Cette commande :

1. Construit les images Docker nécessaires.
2. Démarre le serveur MySQL.
3. Attend que MySQL soit opérationnel.
4. Applique les migrations Prisma existantes.
5. Initialise l'administrateur si aucun compte administrateur n'existe.
6. Démarre l'application Next.js.

L'application est ensuite accessible à l'adresse :

http://localhost:3000

### 4. Vérifier l'état des services

```bash
docker compose --env-file .env.docker ps
```

Les services principaux sont :

| Service | Rôle |
|---|---|
| `db` | Serveur MySQL. |
| `migrate` | Application des migrations et initialisation de l'administrateur. |
| `app` | Application web Next.js. |

Le service `migrate` peut apparaître avec le statut `Exited` après son exécution. C'est normal : il s'agit d'un service ponctuel qui termine son travail avant le démarrage de l'application.

### 5. Consulter les journaux

Pour consulter les journaux de tous les services :

```bash
docker compose --env-file .env.docker logs -f
```

Pour consulter uniquement les journaux de l'application :

```bash
docker compose --env-file .env.docker logs -f app
```

Pour consulter ceux de MySQL :

```bash
docker compose --env-file .env.docker logs -f db
```

### 6. Arrêter les conteneurs

```bash
docker compose --env-file .env.docker down
```

Cette commande arrête et supprime les conteneurs, mais conserve les données persistantes de MySQL.

**Attention :** ne supprimez pas le volume `berem_mysql_data` si vous souhaitez conserver les données de la base.

N'utilisez pas `docker compose down -v` sans vouloir explicitement supprimer les volumes et les données associées.

### 7. Redémarrer l'application

Après une modification du code ou de la configuration nécessitant une reconstruction :

```bash
docker compose --env-file .env.docker up -d --build
```

Pour simplement redémarrer les services :

```bash
docker compose --env-file .env.docker restart
```

## Administration

L'application dispose d'un espace d'administration accessible à l'adresse :

http://localhost:3000/admin

L'initialisation du compte administrateur est prise en charge automatiquement par le service `migrate` lors du premier déploiement, à partir des variables configurées dans `.env.docker`.

Le script d'initialisation vérifie si un administrateur existe déjà. Si c'est le cas, il ne remplace pas ses identifiants.

Les accès administrateur doivent être protégés et les mots de passe conservés de manière sécurisée.

## Structure de la base de données

Le schéma Prisma est défini dans :

```text
prisma/schema.prisma
```

Les migrations sont conservées dans :

```text
prisma/migrations/
```

La configuration Prisma est définie dans :

```text
prisma.config.ts
```

## Déploiement en production

Le déploiement en production s'effectue avec Docker et Docker Compose.

Les éléments nécessaires sont :

- Le dépôt Git du projet.
- Le `Dockerfile`.
- Le fichier `docker-compose.yml`.
- Le fichier `.env.docker.example` servant de modèle de configuration.
- Le schéma Prisma et son historique de migrations.
- Les variables d'environnement propres au serveur.

### Principes à respecter

- Le fichier `.env.docker` doit être créé directement sur le serveur.
- Les identifiants et secrets de production ne doivent jamais être publiés dans le dépôt Git.
- La base MySQL doit utiliser un volume persistant.
- Les migrations doivent être appliquées avant le démarrage de l'application.
- Les URL du site et les paramètres SMTP doivent correspondre à l'environnement de production.

La procédure détaillée de déploiement sera complétée après validation de la configuration sur le serveur cible.