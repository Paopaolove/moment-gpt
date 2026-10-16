# Décisions sur les points ambigus du brief

## 1. Arrivée, « Pas venu » et caution (règle figée par Paolo, corrige l'hypothèse initiale)
- « **Je suis arrivé** » se marque **dès H−15**, avec une **photo facultative**. Ce n'est **pas une obligation** : l'oubli de cliquer n'est jamais puni. La fenêtre technique du bouton reste H−15 → H+15.
- La caution n'est perdue **que** si l'hôte (ou le partenaire du lieu) signale « **Pas venu** », **à partir de H** (jamais avant), et seulement si la place est réellement vide : le signalement est **refusé si l'invité a marqué sa présence**.
- **Le silence profite à l'invité** : sans signalement, la caution de 20 € est **rendue automatiquement le lendemain** (changement de jour civil à Paris). Après restitution, « Pas venu » n'est plus possible. La clôture du moment n'a **aucun effet** sur la caution.
- Absence confirmée par « Pas venu » : partage **6,90 € Moment / 13,10 € hôte** (crédit), absence comptée (2 → perte de priorité, 3 → compte fermé).
- Une présence marquée rend la caution immédiatement (plus favorable à l'invité).
- *Hypothèse abandonnée* : « pas de présence marquée à la clôture = caution perdue ».
- **Annulation par l'invité** : à 3 h ou plus du début (start − now ≥ 3 h), la caution est rendue. À moins de 3 h, sans imprévu accepté ni joker, elle est **perdue** (même répartition).
- Raison : ne jamais punir quelqu'un qui est venu mais a oublié de cliquer ; seul un signalement explicite de place vide coûte la caution. Le seuil de 3 h vient du brief.

## 2. Note sur 3 niveaux et « note ≥ 4 » pour Fiable
- Le brief demande trois niveaux, mais fixe un seuil « ≥ 4 ». C'est incohérent sur une échelle de 3.
- **Décision** : les 3 niveaux affichés (« À revoir », « Bien », « Excellent ») sont stockés sur une échelle de 5 : **1, 3 et 5**. Le badge **Fiable** s'obtient avec **au moins 5 moments honorés** (présence marquée) et une **moyenne des notes du moment reçues ≥ 4/5**. Concrètement : il faut une majorité de « Excellent », aucun cumul de « À revoir ».
- Raison : on garde l'interface simple à 3 choix et le seuil chiffré du brief, avec une règle déterministe et testée. La note du lieu est séparée et ne compte jamais pour Fiable.

## 3. Abonnement
- **L'hôte ne paie jamais d'abonnement**, d'après les règles antérieures, et publier est gratuit. Le partenaire n'a pas d'abonnement dans cette démo.
- Un **abonnement invité** existe dans le modèle sous forme de stub (« Moment+ », non activé, aucun prix réel). Il est uniquement affiché dans Profil pour montrer que la caution en est distincte. Il ne conditionne aucune fonction.

## 4. Crédit
- Un **crédit** est la part de caution versée à l'hôte (13,10 €) quand l'hôte ou le partenaire signale « Pas venu » sur une place réellement vide. C'est un avoir fictif, non encaissable. Moment garde 6,90 €.
- Un crédit a un identifiant unique et peut être **consommé une seule fois**, par exemple pour couvrir sa propre caution de 20 € sur un prochain moment (le complément reste « bloqué » en simulation). Une seconde consommation est refusée. C'est testé.
- Pour l'imprévu et le joker, l'hôte ne touche rien et aucun crédit n'est créé.

## 5. Autres arbitrages
- **Carte** : une carte stylisée des 20 arrondissements, dessinée sans dépendance native, avec des repères au **centroïde du quartier** (jamais l'adresse exacte), une couleur par catégorie, et aucune personne.
- **Adresse** : elle est visible seulement par l'hôte, et par un invité dont la demande est **acceptée (le oui de l'hôte)**. L'adresse complète, avec code d'accès ou étage, s'ajoute après confirmation.
- **Chat** : il s'ouvre à **H−1**, uniquement entre les participants confirmés. Pas de commentaires publics.
- **Sanctions** : un compte fermé ne peut plus demander ni publier. La « perte de priorité » fait passer ses demandes derrière les autres dans la liste de l'hôte.
- **Imprévu** : l'invité ou l'hôte l'envoie une fois par moment, avec une phrase obligatoire (10 à 140 caractères). L'autre accepte, et la caution est rendue, ou il refuse. Un refus, avec annulation à moins de 3 h, entraîne la perte de la caution, sauf si l'invité joue son joker (1 par mois civil, fuseau de Paris).
- **Partenaire** : la validation est manuelle (stub : statut « en revue », puis « validé » par une action de démo). Les demandes sont confirmées automatiquement (acceptation immédiate). Il propose un geste (texte) et/ou une remise en %, cumulables, sans plafond en euros. Son tunnel de publication est distinct.
- **Visiteur** : il navigue librement. Toute action (demander, publier, chat) ouvre une feuille « Créer un compte » (auth stub).
