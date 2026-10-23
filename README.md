# BEREM WEB SITE

## PostgreSQL et Prisma

1. Copiez `.env.example` vers `.env` et remplacez `DATABASE_URL` par l’URL de votre base PostgreSQL.
2. Installez les dépendances avec `pnpm install` (la génération du client Prisma est lancée automatiquement).
3. Après avoir ajouté vos modèles dans `prisma/schema.prisma`, créez une migration avec `pnpm prisma migrate dev --name init`.
4. Importez le client côté serveur avec `import { prisma } from "@/lib/prisma"`.

Commandes disponibles :

- `pnpm db:generate` : régénère le client Prisma.
- `pnpm db:migrate` : applique les migrations en développement.
- `pnpm db:deploy` : applique les migrations en production.
- `pnpm db:studio` : ouvre Prisma Studio.

Le schéma initial ne contient volontairement aucun modèle métier. Ajoutez les modèles nécessaires avant de créer votre première migration.

## Développement

Lancez le serveur de développement avec `pnpm dev`, puis ouvrez [http://localhost:3000](http://localhost:3000).
