# Moment GPT Pro

Une invitation à un moment en vrai à Paris : table, verre, sport ou culture. Démo Expo SDK 57, TypeScript et react-native-web. Authentification, caution et abonnement simulés ; aucune transaction réelle. Les données sont en mémoire et se réinitialisent au rechargement.

## Architecture

- `src/domain` : règles métier, reducer immuable, sélecteurs de confidentialité, temps de Paris et onboarding. Comportement conservé.
- `src/theme` : palette claire, accent anthracite unique, couleurs de statut, typographie et espacements.
- `src/components/UI.tsx` : composants partagés accessibles, cartes, feuilles, formulaires, états et navigation.
- `src/store.tsx` : adaptation du domaine à React et horloge de démo unique, avancée chaque seconde et par les commandes de démo.
- `src/Journey.tsx` : quatre onglets, onboarding explicite, tunnel partenaire et parcours invité. L’ancienne UI et `src/legacy` sont supprimés.

## Couverture du brief

Découverte sans compte, filtres et urgent, liste et grille géographique des 20 arrondissements, aperçu de carte, chargement simulé, états vide et erreur. Détail confidentiel avant acceptation, auth stub, demandes et confirmation chronométrée, caution, présence H−15, chat local H−1, imprévu avec phrase, joker mensuel et annulation. Notes séparées à trois niveaux, photos par lien avec consentement, relance et publication avec aperçu. Profil, sanctions et crédits à usage unique. Demande partenaire, revue, validation de démo et publication séparée avec geste/remise.

La carte est schématique : les repères sont regroupés au centre des arrondissements, sans position d’adresse. Les photos sont ajoutées par URL HTTPS ; pas d’accès à la photothèque. La messagerie reste locale. L’identité femme peut être choisie dans Démo via un compte distinct. Les notes et crédits suivent exclusivement les validations du domaine.

## Décisions de design

Fond blanc, surfaces `#F7F7F5`, texte `#111111`, CTA `#1F2937`. Inter Tight 400/500/600/700 ; Fraunces pour le mot-symbole uniquement. Cibles de 44 px minimum, tailles de texte adaptatives plafonnées raisonnablement, transitions de 240 ms, préférence de réduction des animations respectée. Feuilles natives et retour haptique léger sur les confirmations. Voir `BRIEF.md` et `BRIEF-DECISIONS.md` pour les arbitrages métier.

## Lancer

`npm install`, puis `npm start` (Expo), `npm run ios`, `npm run android` ou `npm run web`. Les dépendances requises sont déjà déclarées dans le projet. Aucun service distant à configurer.

Pour filmer : explorer sans compte, demander une place, créer le compte simulé, redemander, puis Profil → Démo → Faire accepter par l’hôte. Confirmer dans Mes moments, avancer à H−15, marquer sa présence, puis terminer après la fin pour noter le moment. H+30 reste distinct de la clôture à la fin réelle du moment.

## Validation

```sh
npx tsc --noEmit
npm test
npx expo export --platform web
```

Les tests historiques liés à `legacy` ont été remplacés par des scénarios du domaine actuel ; les tests d’acceptation, règles et présentation sont conservés.
