# Moment GPT Funky

## Manifeste
Paris a toujours des places libres. Ce soir, on en fait une fête : le Grand Bal des places libres. Quelqu’un vous offre une place à côté de lui. On rejoint un moment, pas un profil : IRL, Paris intramuros, sans dating. Une affiche de concert des années 70, du Palace à la Fête de la musique, avec des règles qui restent intactes.

## Nouveautés Funky
- Fraunces Black et Inter Tight Black, palette tomate, rose, soleil, outremer et prune.
- Affiches sérigraphiées, stickers, bandeaux défilants, rideau et boule à facettes.
- Roulette à trois rouleaux vers une vraie place disponible ; météo d’ambiance pour les 20 arrondissements.
- Acceptation avec tampon éclaboussé, confettis et compte à rebours au beat ; talon qui s’envole et carnet de badges.
- Préférence système de réduction des animations : fondus, sans rideau, pulsation ni confettis.
- Caution 20 €, confirmation 10 minutes, présence H−15 et joker inchangés. Démonstration locale sans paiement.


Prototype Expo SDK 57 / TypeScript, direction C de [VISION.md](VISION.md).
Quelqu’un a une place à côté de lui : au bistrot, sur un terrain, dans une salle.

Le parcours : accueil-manifeste en trois temps → Les places → Le billet → Prendre la place → Billet confirmé. Deux onglets seulement : **Les places** et **Offrir une place**. Le logo ouvre le manifeste ; les billets en cours restent accessibles dans Les places.

Billets crème, perforations et sièges dessinés en View, aucun portrait ni photo. Fond encre nocturne, grands chiffres serif, filigranes d’arrondissement et une seule action vermillon par écran. Animated fait glisser le billet, détache le talon et remplit les sièges ; la préférence système de réduction des mouvements désactive les transitions.

## Essayer le parcours

- Choisir Table, Sport ou Culture ; Maintenant filtre exactement de H−90 à H+30.
- Ouvrir un billet puis prendre la place. Pour Femmes uniquement, la déclaration est requise.
- L’acceptation hôte est simulée explicitement. Le délai de 10 minutes démarre alors : compteur et barre, puis état expiré sans caution. Confirmer réserve fictivement 20 €.
- Le talon affiche le lieu et la caution. La présence devient disponible à H−15 ; la déclarer rend la caution. Un joker par mois civil parisien permet de rendre la place avec restitution.
- Offrir une place : catégorie et sous-type, adresse Paris intramuros, arrondissement, date et heure de Paris, 1 à 3 places, invitation par personne via pills 10/20/30/40 € ou saisie jusqu’à 50 €, Femmes uniquement. La publication apparaît dans le flux. Hôte gratuit, sans abonnement.

Le seed est relatif au démarrage : bistrots du 11e, padel à Louis-Lumière, footing aux Buttes-Chaumont, piscine Joséphine-Baker, Le Champo, Philharmonie, Palais de Tokyo et Odéon. Les horaires, disponibilités, notes et programmes sont fictifs.

## Vérifier

```sh
npx tsc --noEmit
npm test
npx expo export --platform web
```

L’export statique est produit dans `dist/`. Aucun serveur n’est nécessaire à ces vérifications. Aucune dépendance ajoutée.

## Domaine et limites

`src/domain` conserve les règles et le reducer : caution 20 €, split 6,90 € Moment / 13,10 € hôte en cas d’annulation sans joker après confirmation, délai 10 minutes, joker 1/mois, urgence H−90→H+30, présence H−15, Paris, restrictions et plafonds. Les catégories sont Table / Sport / Culture. Les tests couvrent notamment les bornes temporelles, autorisations, montants, catégories et seed.

Tout est local en mémoire : un rechargement réinitialise la démonstration. Aucun compte, paiement, réservation de lieu, géocodage, messagerie distante ni backend. L’acceptation de l’hôte est un stub, sans délai réseau. Les anciens écrans carte, disponibilités, abonnements et profils ont été retirés pour concentrer le prototype sur la place.


## Nouveautés v3

- Fraunces optique 144 et Inter Tight, papier grainé, guilloché et tampon GPT 4.
- Sièges individuels : une réservation remplit exactement un siège.
- Offre en trois étapes, raccourcis et aperçu du billet avant publication.
- Acceptation automatique de démonstration après 2,5 secondes, tampon ACCEPTÉ et délai de 10 minutes.
- Transition mesurée entre carte et détail, retour inverse, option système de réduction des animations et haptique native facultative.
- « Ce soir, 1 place » dans la fenêtre H−90 → H+30 et carnet personnel de souches.
- Joker réservé à l’invité confirmé, une fois par mois civil à Paris : caution libérée intégralement. Annulation sans joker : 6,90 € Moment / 13,10 € hôte.

Les données et paiements restent des simulations locales. Le carnet compte uniquement les arrondissements où une présence a été signalée.

## Nouveautés v4

- En-tête compact, date éditoriale, filtres texte et billet à la une intégré au flux.
- Délais avec unités explicites et présence verrouillée jusqu’à H−15.
- Créneau futur adapté au sous-type, conservé après un choix manuel.
- Vol du billet en 400 ms, chiffres indépendants, frappe du tampon et détachement du talon ; réduction des mouvements respectée.
