# BEREM WEB SITE

Application web de présentation et de gestion des activités de BEREM, développée avec Next.js, Prisma et MySQL.

## Technologies utilisées

- **Next.js** : framework web.
- **React** : interface utilisateur.
- **TypeScript** : typage.
- **Tailwind CSS** : styles.
- **Prisma ORM** : gestion de la base de données.
- **MySQL 8.4** : système de gestion de base de données.
- **Docker** : conteneurisation de l'application et de la base de données.
- **pnpm** : gestionnaire de dépendances.

## Prérequis

Pour travailler sur le projet, il faut disposer de :

- Node.js 22 ou supérieur.
- pnpm 10 ou supérieur.
- MySQL 8.4 ou Docker avec Docker Compose.

## Installation et configuration

### 1. Récupérer le projet

```bash
git clone <URL_DU_DEPOT>
cd berem_web_site
```

### 2. Installer les dépendances

```bash
pnpm install
```

La génération du client Prisma est exécutée automatiquement lors de l'installation.

### 3. Configurer les variables d'environnement

Copiez le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Renseignez ensuite les variables nécessaires, notamment :

- `DATABASE_URL` : URL de connexion à la base MySQL.
- Les paramètres SMTP pour l'envoi des emails.
- Les identifiants Cloudinary pour la gestion des médias.
- Les secrets nécessaires à l'authentification et à la sécurité.

Ne partagez jamais votre fichier `.env` et ne le versionnez pas dans Git.

## Base de données et Prisma

Le projet utilise MySQL avec Prisma ORM.

### Commandes disponibles

| Commande | Description |
| --- | --- |
| `pnpm db:generate` | Génère le client Prisma. |
| `pnpm db:migrate` | Crée et applique une migration en développement. |
| `pnpm db:deploy` | Applique les migrations existantes. |
| `pnpm db:studio` | Ouvre Prisma Studio. |

### Créer une migration

Après avoir modifié les modèles dans `prisma/schema.prisma`, créez une migration :

```bash
pnpm prisma migrate dev --name nom_de_la_migration
```

En production, les migrations doivent être appliquées avec :

```bash
pnpm db:deploy
```

Le dossier `prisma/migrations` doit être présent dans le dépôt Git afin de conserver l'historique des migrations.

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

Ouvrez ensuite :

<http://localhost:3000>

Pour vérifier les erreurs TypeScript :

```bash
pnpm exec tsc --noEmit
```

## Exécution avec Docker

Le projet dispose d'une configuration Docker permettant de démarrer l'application Next.js et la base de données MySQL.

### Prérequis

- Docker Engine ou Docker Desktop.
- Docker Compose.

### Configuration

Copiez le fichier `.env.example` vers `.env` et renseignez les variables nécessaires à l'application.

Configurez également le fichier `.env.docker` avec les paramètres de connexion MySQL utilisés par Docker.

Exemple de configuration :

```env
MYSQL_DATABASE=berem
MYSQL_USER=berem
MYSQL_PASSWORD=votre_mot_de_passe
MYSQL_ROOT_PASSWORD=votre_mot_de_passe_root

DOCKER_DATABASE_URL=mysql://berem:votre_mot_de_passe@db:3306/berem
```

Remplacez les valeurs d'exemple par vos propres identifiants.

### Démarrer les conteneurs

```bash
docker compose --env-file .env.docker up -d --build
```

Cette commande :

1. Construit les images Docker.
2. Démarre le serveur MySQL.
3. Attend que MySQL soit opérationnel.
4. Applique les migrations Prisma.
5. Démarre l'application Next.js.

L'application est ensuite accessible à l'adresse :

<http://localhost:3000>

### Consulter les journaux

```bash
docker compose logs -f
```

Pour consulter uniquement les journaux de l'application :

```bash
docker compose logs -f app
```

### Arrêter les conteneurs

```bash
docker compose down
```

Cette commande arrête et supprime les conteneurs sans supprimer les données persistantes de MySQL.

**Attention :** ne supprimez pas le volume `berem_mysql_data` si vous souhaitez conserver les données de la base.

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

Le déploiement en production s'effectue avec Docker.

Les éléments nécessaires sont :

- Le dépôt Git du projet.
- Le `Dockerfile`.
- La configuration Docker Compose de production.
- Le schéma Prisma et son historique de migrations.
- Les variables d'environnement de production.

La base MySQL doit utiliser un volume persistant afin de préserver les données lors des redémarrages et mises à jour.

Les identifiants et secrets de production doivent être configurés directement sur le serveur et ne doivent jamais être publiés dans le dépôt Git.

La procédure détaillée de déploiement sera documentée dans une section dédiée après validation de la configuration de production.
