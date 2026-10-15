# Moment

Des invitations IRL à Paris intramuros, autour d’un resto ou d’un verre. Moment est une expérience de sociabilité, sans visée amoureuse.

Application Expo SDK 57, React 19 et React Native, entièrement en TypeScript strict. Aucune dépendance ajoutée pour cette refonte.

## Direction visuelle

Papier chaud, encre et un accent brique. Typographie système avec titres sérif, grands espaces, filets fins, aucun effet d’ombre. Une seule action pleine par écran ; les choix secondaires sont détourés. Les apparitions utilisent `Animated`, avec prise en compte de la réduction des animations. Les composants natifs portent leurs libellés et états d’accessibilité. Le contenu défile, y compris l’accueil sur les petits écrans.

## Parcours

- Trois slides présentent l’esprit, les invitations et l’engagement.
- **Invitations** : filtres Resto / Bar, urgence et Femmes uniquement ; détail du rendez-vous et demande de place.
- **Mes moments** : demandes, états de réservation et invitations publiées.
- **Proposer** : lieu, arrondissement, horaire relatif, 1 à 3 places, montant et public ; confirmation de publication.
- **Profil** : déclaration pour les invitations réservées aux femmes, Joker, engagements et atelier de simulation.

Après une demande, le bouton explicitement marqué « Simuler » joue l’acceptation de l’hôte. Le compte à rebours mène à la confirmation et à la réservation fictive de la caution. La présence apparaît dès H−15. L’annulation ordinaire demande une confirmation ; le Joker libère la caution. Une action de démonstration permet aussi d’observer l’annulation par l’hôte. Dans Profil, l’atelier avance l’horloge de 10 minutes, 45 minutes ou 31 jours et affiche les crédits fictifs.

## Règles centralisées

`src/domain/rules.ts` est la référence :

| Règle | Valeur |
| --- | --- |
| Caution distincte de l’invitation | 20 € |
| Annulation de l’invité confirmé sans Joker | 6,90 € Moment / 13,10 € hôte |
| Présence ou annulation par l’hôte | Caution libérée |
| Confirmation après acceptation | 10 minutes, échéance exclusive |
| Joker | 1 par mois civil, Europe/Paris |
| Urgence | H−90 à H+30, bornes incluses |
| Présence | Visible et autorisée dès H−15 |
| Table | 1 à 3 places proposées |
| Invitation | Resto ou Bar, 0 à 50 € ; pills 10 / 20 / 30 / 40 € |
| Public | Mixte ou Femmes uniquement |
| Territoire | Paris intramuros, arrondissements 1 à 20 |
| Abonnement hôte | Gratuit |

Les montants sont des entiers en centimes. La caution est un état de réservation fictif : aucune monnaie ni transaction réelle. Le reducer garde les transitions : identité de l’hôte et de l’invité, échéance même sans tick préalable, présence, Joker mensuel, validation des publications et absence de double crédit après annulation.

## Architecture

```text
App.tsx                       Accueil, providers et zone sûre
src/navigation/index.tsx      Navigation à quatre onglets
src/domain/rules.ts           Constantes, types, validation et temps parisien
src/domain/reducer.ts         Transitions pures et crédits fictifs
src/domain/seed.ts            Trois invitations de démonstration
src/store.tsx                 Adaptateur React, horloge et dispatch
src/theme/index.ts            Palette, typographie et espacements
src/components/UI.tsx         Primitives accessibles et animation
src/screens/Onboarding.tsx    Accueil en trois slides
src/screens/Screens.tsx       Invitations, détail, agenda, création et profil
tests/*.test.cjs              Tests Node du domaine TypeScript
```

## Vérifications

Avec les dépendances installées :

```sh
npx tsc --noEmit
npm test
```

Les tests transpilent les modules TypeScript en mémoire avec le compilateur déjà installé. Ils couvrent les bornes temporelles, le mois parisien en hiver et en été, la validation, les acteurs autorisés, l’expiration, la présence, les annulations, le Joker et les crédits sans double répartition.

## Limites volontaires du prototype

Tout est en mémoire et se réinitialise au redémarrage, accueil inclus. Pas de backend, d’authentification réelle, de notifications ni d’échange entre utilisateurs. Une réservation de démonstration par invitation ; les places représentent la capacité annoncée, pas un inventaire multiutilisateur.

L’adresse est déclarative : mention Paris obligatoire, arrondissement et code postal contrôlés si fourni. Aucun géocodage ne certifie l’emplacement ; un service de vérification serait nécessaire avant une ouverture réelle. Les horaires sont relatifs à l’horloge de démonstration et affichés dans le fuseau Europe/Paris.

Stubs uniquement : aucun paiement, aucun Stripe live, aucun EAS. Aucun serveur Expo ou tunnel n’a été lancé pour cette refonte. La validation automatique ne remplace pas une recette visuelle sur appareils iOS et Android.
