# Cahier des charges — Moment (référence, fait foi)

1. Objet : app mobile iOS et Android pour un moment en vrai à Paris intramuros. L'unité est l'invitation, pas le profil. Ce n'est pas une app de rencontre amoureuse.
2. Objectifs : un hôte propose une place, un invité la prend, avec un engagement financier et une heure de rendez-vous. Réduire le no-show. Ne pas ressembler à une app de swipe.
3. Utilisateurs :
- Particulier : propose ou rejoint, une annonce active, une à trois places, publier est gratuit.
- Partenaire : représente un lieu. Entrée par le profil, validation manuelle (stub). Confirmation automatique. Offre un geste ou une remise, pas un plafond en euros.
- Visiteur : voit le fil sans compte ; le compte est demandé pour agir (auth stub).
4. Périmètre : Paris intramuros. Sport, culture, table, verre (sport et culture possibles, pas obligatoires en ouverture). L'urgent « déjà sur place » est dans le périmètre. Hors périmètre : groupe de six, fil social, likes, commentaires publics, swipe, communauté de profils, paiement réel.
5. Exigences fonctionnelles :
- Découverte : fil visible sans compte, en liste et en carte. La carte montre des moments, pas des personnes. Quartier avant confirmation, adresse après.
- Publication : une annonce à la fois. Catégorie, lieu, horaire, 1 à 3 places, montant jusqu'à un plafond pour un particulier (pastilles 10/20/30/40, plafond 50 €). Un champ libre à côté de chaque pastille. Option femmes uniquement.
- Demande : l'invité demande, l'hôte accepte, puis l'invité a 10 minutes pour confirmer. Non confirmé : annulé. Une acceptation annule les autres demandes du même invité.
- Caution : 20 € bloqués à la confirmation, distincts de l'abonnement et du repas. Rendus si présent. Perdus si trop tard ou absent : 6,90 € Moment, 13,10 € hôte.
- Temps : chat à H−1. Urgent de H−90 à H+30. Présence marquable à H−15. Annulation à 3 h ou plus : caution rendue.
- Imprévu : une fois par moment, avec une phrase. Si l'autre accepte : caution rendue. Joker : un par mois, caution rendue même en cas de refus. L'hôte ne touche rien.
- Sanctions : deux absences, perte de priorité ; trois, compte fermé. Hôte absent : un avertissement, la seconde fois compte fermé.
- Après : note du moment et note du lieu, séparées, sur trois niveaux. Photos du lieu et des personnes à table (1 ou 2), visibles si accord. Relance « Refaire un moment avec ». Badge Fiable après 5 moments et une note ≥ 4.
- Partenaire : auto-confirmation, offre en geste ou en pourcentage (cumulables), tunnel différent de celui du particulier.
8. Critères d'acceptation : un visiteur voit des moments sans compte ; un invité ne confirme pas après 10 min, ni un urgent après H+30 ; une caution ne se rend pas avant H−15 ; un invité ne peut pas annuler comme hôte ; un crédit ne se consomme pas deux fois ; l'adresse n'apparaît pas avant le oui ; les slides ne changent pas sans décision.
9. État : démo simulée, auth et Stripe non branchés.
