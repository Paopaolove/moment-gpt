# Moment — La place libre

Prototype Expo SDK 57 / TypeScript, direction C de [VISION.md](VISION.md).
Quelqu’un a une place à côté de lui : au bistrot, sur un terrain, dans une salle.

Le parcours : accueil-manifeste en trois temps → Les places → Le billet → Prendre la place → Billet confirmé. Deux onglets seulement : **Les places** et **Offrir une place**. Le logo ouvre le manifeste ; les billets en cours restent accessibles dans Les places.

Billets crème, perforations et sièges dessinés en View, aucun portrait ni photo. Une seule action abricot par écran. Animated fait glisser le billet, détache le talon et remplit les sièges ; la préférence système de réduction des mouvements désactive les transitions.

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
