# Moment — Vision (itération 4)

## Constat sur la version actuelle (main, 11f362a)
- **Un catalogue, pas une idée.** 14 écrans de même poids (fil, dispo, carte, avis, lieu…) : l'app explique tout, mais ne fait ressentir rien. Le parcours central (découvrir → demander → confirmer) est noyé.
- **Rétrécie à la table.** La v1 (40aa441) avait Resto/Bar/Balade/Culture. Au commit 550c205, les catégories sont devenues `['Resto', 'Bar']` : la règle figée « pills 10/20/30/40 Resto/Bar » a été lue comme une liste fermée de catégories. Le sport n'a jamais existé.
- **Une copie de Chance.** Même vocabulaire, mêmes écrans, même structure en onglets. Rien ne dit pourquoi Moment existerait à côté.

## Trois directions radicalement différentes

### A. « L'Édition du soir »
Chaque jour à 17 h paraît une édition : une douzaine de moments triés comme un journal (Table, Sport, Culture), puis plus rien jusqu'au lendemain.
- Avantages : rareté, rituel quotidien, identité éditoriale forte, contenu toujours frais.
- Risques : il faut une offre suffisante chaque jour ; c'est frustrant hors de l'heure de parution ; ça demande une curation (humaine ou algorithmique).

### B. « Paris en direct »
La carte de Paris intramuros est l'écran. Des points s'allument là où une place se libère, et pulsent à H−15 (présence visible).
- Avantages : spontanéité, urgence H−90→H+30 naturelle, très démonstratif.
- Risques : une carte vide est mortelle, le géolocalisé évoque le dating, c'est lourd techniquement (cartes natives).

### C. « La place libre » ← choisie
Une seule métaphore pour tout : **quelqu'un a une place à côté de lui** et vous l'offre. La chaise en face au bistrot, le siège voisin au Champo, la quatrième raquette au padel, le billet en trop pour la Philharmonie. On ne « matche » pas une personne, on **prend une place**, 1 à 3 par moment.
- Avantages : Table, Sport et Culture sont unifiés naturellement ; la règle des 1–3 places devient le cœur du produit ; l'invitation à 10–40 € (max 50) correspond au repas, à la place ou à l'entrée ; c'est clairement « pas un date » (on rejoint un moment, pas un profil) ; le parcours est ultra court.
- Risques : il faut des hôtes ayant réellement une place ; la confiance repose sur la caution de 20 € et les avis ; « place » peut sembler transactionnel si le ton est mal tenu.

## Pourquoi C
C'est la seule direction qui transforme les règles figées en promesse produit au lieu de contraintes : 1–3 places, la caution qui « tient » la place, 10 min pour la confirmer, le joker pour la rendre, l'urgent (une place qui se libère maintenant). Elle peut ensuite absorber A (une sélection du soir) ou B (une vue carte) sans changer d'idée.

## Le prototype (parcours central, pas l'exhaustivité)
1. **Accueil-manifeste** : 3 temps, une phrase chacun (« Quelqu'un, ce soir, a une place à côté de lui. »).
2. **Les places** : un flux vertical de cartes « billet », avec Table / Sport / Culture et un filtre « Maintenant » (urgent H−90→H+30). Chaque carte montre les places libres sous forme de sièges.
3. **Le billet** : le lieu, l'heure, l'hôte (prénom et note, pas de photos glamour), ce qui est offert (pill 10/20/30/40 €), les sièges, l'option Femmes uniquement.
4. **Prendre la place** : la caution de 20 € expliquée en une ligne (rendue si présent ; sinon 6,90 € Moment / 13,10 € hôte), puis 10 min pour confirmer avec un compte à rebours lisible.
5. **Le billet confirmé** : le talon, la présence visible dès H−15, le joker (1/mois) pour rendre la place.
6. **Offrir une place** (hôte, gratuit, sans abonnement) : catégorie, lieu, heure, nombre de places (1–3), invitation (pills, max 50 €), Femmes uniquement.

Le reste (chat, avis, abonnement invité) est réduit à son minimum ou mis de côté.

## Matière
Le **billet** : papier crème épais, perforations, talon détachable, chiffres en grand (heure, prix, places). Encre presque noire, un seul accent (abricot) pour l'action principale, aucune ombre, des filets fins. Animations : le billet glisse, le talon se détache à la confirmation, les sièges se remplissent.
