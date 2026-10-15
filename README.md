# Moment

Des invitations IRL à Paris intramuros, autour d’un resto ou d’un verre. Une expérience de sociabilité, sans visée amoureuse.

Expo SDK 57 · React 19 · React Native · TypeScript strict. Aucune dépendance ajoutée pour cette réécriture.

## Une interface, quatorze écrans

Chaque écran possède son fichier dans `src/screens/` et sa destination typée dans `src/navigation/context.tsx`.

| Écran | Accès et expérience |
| --- | --- |
| Onboarding | Au lancement : trois slides plein écran, swipe, pagination animée, défilement vertical sur petit écran |
| Fil | Explorer : invitations, filtres Resto/Bar/urgence, apparitions échelonnées |
| Détail | Depuis une invitation : hôte, lieu, horaire, demande de place |
| Dispo | Depuis le fil : disponibilité et catégorie, résultats selon le créneau annoncé |
| Publier | Proposer : lieu parisien, 1–3 places, Resto/Bar, Femmes uniquement, pills 10/20/30/40 €, maximum 50 € |
| Demandes | Mes moments : suivi des demandes et tables publiées |
| Confirmation | Après acceptation simulée : compte à rebours animé de 10 minutes, caution et répartition |
| Chat | Après confirmation : messages locaux, présence visible dès H−15, accès à l’imprévu |
| Imprévu / Joker | Depuis le chat ou le profil : un Joker par mois, annulation ordinaire en deux étapes |
| Abonnements | Depuis le profil : présentation des formules, hôte gratuit, aucune souscription réelle |
| Profil | Moi : déclaration pour les invitations entre femmes, avis, Joker, atelier de simulation |
| Avis | Depuis le chat après présence, ou le profil : note et texte, un avis local par moment |
| Fiche lieu | Depuis le détail ou le chat : adresse déclarée et rendez-vous |
| Carte | Depuis le fil ou le lieu : carte stylisée des vingt arrondissements et invitations sélectionnables |

La navigation conserve un historique en mémoire et gère le retour Android. Les transitions d’écran utilisent `Animated`. La barre de navigation et tous les boutons passent par `PressableScale`.

## Design system

Une matière papier, une palette crème/encre/terre cuite, une gamme typographique sérif et système, des espaces généreux : `src/theme/index.ts`. Pas d’ombres lourdes. Une seule action principale pleine par écran ; les autres actions sont détourées.

Composants séparés dans `src/components/` : `Button`, `Pill`, `Card`, `Header`, `Countdown`, `Avatar`, `AnimatedEntry`, `PressableScale`, `MomentCard`, `TableArt` et primitives de mise en page. Les illustrations de table et la carte sont composées de vues React Native, sans images distantes ni dépendance native nouvelle.

Animations avec `Animated` et `useNativeDriver: true` : entrées fade/slide échelonnées, transitions, pression par ressort, sélection des pills, décompte pulsé avec barre de progression et pagination liée au swipe. Les entrées et transitions respectent la réduction des animations du système. Libellés et états d’accessibilité sur les contrôles, clavier évitable sur iOS, zones sûres et contenu défilant.

## Règles centralisées

`src/domain/rules.ts` est la référence. Le reducer applique les gardes, y compris lorsque l’écran n’est pas visible.

| Règle | Valeur |
| --- | --- |
| Caution distincte de l’invitation | 20 € |
| Annulation de l’invité confirmé sans Joker | 6,90 € Moment / 13,10 € hôte |
| Présence ou annulation par l’hôte | Caution libérée |
| Confirmation après acceptation | 10 minutes, expiration à l’échéance exacte |
| Joker | 1 par mois civil, Europe/Paris |
| Urgence | H−90 à H+30, bornes incluses |
| Présence | Visible et autorisée dès H−15 |
| Table | 1 à 3 places |
| Invitation | Resto ou Bar, 0 à 50 € |
| Public | Mixte ou Femmes uniquement |
| Territoire | Paris intramuros, arrondissements 1 à 20 |
| Abonnement hôte | Gratuit |

Les montants sont des entiers en centimes. Les horaires suivent `Europe/Paris`, y compris les changements d’heure. Le calcul du décompte est plafonné à dix minutes et atteint zéro à l’échéance.

## Validation et recette

```sh
npx tsc --noEmit
npm test
```

Les tests du domaine existants sont conservés et étendus : bornes temporelles, changements d’heure, mois parisien, validation, acteurs autorisés, expiration sans tick, présence, annulations, Joker et crédits sans double répartition. S’ajoutent le compte à rebours, les messages après confirmation et les avis après présence.

Parcours de démonstration :

1. Passer les trois slides, ouvrir une invitation et demander une place.
2. Dans Mes moments, choisir « Simuler l’accord de l’hôte ». Observer le décompte, puis confirmer la caution fictive.
3. Écrire un message local dans le chat. Revenir : les messages restent disponibles pendant la session.
4. Pour la table du canal, la présence est immédiatement disponible. Pour les autres tables, utiliser Moi → atelier démo → avancer de 45 minutes, puis revenir au chat.
5. Signaler sa présence : caution libérée, avis disponible. Autre possibilité avant présence : Imprévu → Joker ou annulation sans Joker.
6. Pour vérifier l’expiration, accepter une autre demande, puis avancer de 10 minutes dans l’atelier.
7. Publier une invitation, consulter sa fiche lieu et la sélectionner sur la carte.

## Limites du prototype

Tout est en mémoire et se réinitialise au redémarrage, onboarding inclus. Aucun backend, authentification réelle, échange entre utilisateurs ni notification. Les messages sont locaux ; le message d’accueil est un exemple clairement identifié. Les avis ne sont pas publiés sur un service externe.

Une réservation de démonstration par invitation ; les places représentent la capacité annoncée, sans inventaire multiutilisateur. Les adresses sont déclaratives : mention Paris obligatoire, arrondissement et code postal contrôlés si fourni. Aucun géocodage. La carte utilise des repères schématiques par arrondissement, sans localisation précise ni itinéraire.

Les offres invités n’ont pas de tarifs commercialisés dans ce prototype. Aucun abonnement n’est activé. Stubs uniquement : aucun paiement réel, aucun Stripe live, aucun EAS. Aucun serveur Expo ni tunnel requis pour les vérifications. Une recette visuelle sur appareils iOS et Android reste à effectuer.
