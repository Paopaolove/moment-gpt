# Moment

**Un moment à partager.** Une application d’invitations IRL à Paris intramuros, sans visée amoureuse. Interface et contenus en français.

## Lancer

Les fichiers ont été écrits à la main. Aucune installation de dépendances n’a été exécutée. Dans un environnement où les dépendances sont disponibles :

```sh
npm start
npm run ios
npm run android
npm run web
npm run typecheck
npm test
```

Expo `~57.0.0`, React 19.2.3, React Native 0.86.3, React Navigation 7 et TypeScript strict. La correspondance SDK 57 / React Native 0.86 est documentée dans le [changelog officiel Expo](https://expo.dev/changelog/sdk-57). Aucun EAS ni service backend n’est configuré.

## Écrans

- **Découvrir** : invitations éditoriales, filtres Resto / Bar / Balade / Culture et filtre « À l’improviste ». Les cartes ouvrent une fiche détaillée.
- **Fiche d’invitation** : lieu, horaire de Paris, prix, places et description ; demande de place ; acceptation simulée par l’hôte ; compte à rebours de confirmation ; caution fictive ; présence et annulation.
- **Mes moments** : demandes, confirmations, présences, annulations, expirations et invitations publiées.
- **Proposer** : titre, catégorie, adresse, arrondissement, 1 à 3 places, horaire relatif, montant, description et option « Femmes uniquement ». Publication locale immédiate.
- **Profil** : déclaration de genre pour les invitations réservées aux femmes, Joker mensuel, règles et horloge de démonstration.

## Règles et simulations

- Caution de **20 €**, distincte du montant de l’invitation. En cas d’annulation après confirmation sans Joker, répartition simulée de **6,90 € Moment / 13,10 € hôte**. Présence ou Joker : caution libérée fictivement.
- **10 minutes** pour confirmer une acceptation. À la limite exacte, elle expire automatiquement ; aucune caution n’est réservée.
- **1 Joker par mois civil**, selon le fuseau Europe/Paris. Utilisable sur une réservation confirmée.
- Moments urgents entre **H−90 et H+30**, bornes incluses.
- Option **Femmes uniquement** appliquée à la demande de place, avec genre déclaré dans le profil.
- Tables de **1 à 3 places** proposées. Aucun parcours de groupe plus grand.
- **Paris uniquement**, sélection d’un arrondissement de 1 à 20. L’adresse est déclarative : le prototype sans géocodage ne peut pas vérifier physiquement un lieu. Tous les exemples sont intramuros.
- L’hôte ne paie pas d’abonnement. Aucun abonnement n’est débité ou vendu.
- Invitation entre 0 et **50 €**, avec pastilles **10 / 20 / 30 / 40 €** pour Resto et Bar.
- Bouton **« Je suis sur place » masqué avant H−15**, puis visible et actif pour une réservation confirmée ; même règle vérifiée dans la transition d’état.

Les invitations d’exemple sont ancrées à l’heure du lancement. Un exemple commence dans 10 minutes pour tester immédiatement la présence. Pour tester une expiration, demander une place, simuler l’acceptation, puis avancer de 10 minutes dans Profil. Pour tester H−15, choisir le restaurant qui commence dans une heure, confirmer et avancer de 45 minutes.

L’horloge avance aussi naturellement. Les données disparaissent au redémarrage. Aucun paiement réel, Stripe, stockage persistant, réseau applicatif, authentification, géolocalisation ni message envoyé à autrui. Un seul membre est simulé : les demandes d’autres personnes aux invitations que vous publiez ne sont pas générées. Une demande occupe au plus une place ; il n’existe pas de réservation de groupe.

## Direction visuelle

Papier `#F7F1EA`, cartes `#FBF8F4`, filet 1 px `#E7DFD6`, rayon 16, aucune ombre. Abricot `#E37A55` comme seul accent, texte `#1C1917`, secondaire `#6F675E`. Titres sérif, respirations généreuses, boutons secondaires en contour. Au plus un bouton plein par écran.

## Structure et vérification

- `App.tsx` : navigation par onglets et zones sûres.
- `src/screens/Screens.tsx` : écrans et fiche modale.
- `src/store.tsx` : état en mémoire, horloge, transitions et Joker.
- `src/domain/` : règles pures et invitations initiales.
- `src/components/UI.tsx`, `src/theme.ts` : composants et design.
- `tests/rules.test.cjs` : tests des bornes temporelles, des montants, de la validation et du mois parisien. TypeScript est utilisé pour charger le module métier sans générer de fichiers.

Vérification effectuée sans installation : compilation TypeScript stricte avec les dépendances déjà présentes dans un dossier voisin (lien temporaire retiré), et tests métier réussis. Cette vérification ne remplace pas un lancement sur appareil avec les versions exactes du manifeste. Aucun simulateur ni aperçu visuel n’a été exécuté.
