import type { Moment } from '../domain/rules';
/** Local scenarios only: no venue availability or profile is fetched. */
export function additionalInvitations(now: number): Moment[] {
  return [
    {
      id: 'voltaire',
      hostId: 'lea',
      host: 'Léa',
      title: 'On partage les petites assiettes ?',
      category: 'Resto',
      district: 11,
      address: '107 avenue Parmentier, 75011 Paris',
      startsAt: now + 180 * 60000,
      seats: 3,
      price: 3000,
      womenOnly: false,
      description:
        'Rendez-vous devant Le Châteaubriand, une adresse pour les curieux de cuisine. J’aime les produits de saison et les discussions qui partent de travers. On vérifiera ensemble la disponibilité du lieu avant de se retrouver. Exemple d’invitation, sans réservation réelle.',
    },
    {
      id: 'odéon',
      hostId: 'sacha',
      host: 'Sacha',
      title: 'Un café qui devient une soirée.',
      category: 'Bar',
      district: 6,
      address: '43 rue de Seine, 75006 Paris',
      startsAt: now + 80 * 60000,
      seats: 2,
      price: 1000,
      womenOnly: false,
      description:
        'Autour de La Palette, pour prendre le pouls de Saint-Germain. Un verre avec ou sans alcool et une conversation sans programme. Je travaille dans l’édition et je collectionne les recommandations de lecture. Adresse indicative, table à vérifier ensemble.',
    },
    {
      id: 'jussieu',
      hostId: 'nora',
      host: 'Nora',
      title: 'La rive gauche prend son temps.',
      category: 'Resto',
      district: 5,
      address: '39 rue des Écoles, 75005 Paris',
      startsAt: now + 1500 * 60000,
      seats: 2,
      price: 4000,
      womenOnly: true,
      description:
        'Une soirée entre femmes près du Champo, dans le Quartier latin. Une table autour de la rue des Écoles, des envies de cinéma et de bons petits plats. Nous choisirons les détails dans la conversation. Scénario de démonstration.',
    },
    {
      id: 'batignolles',
      hostId: 'hugo',
      host: 'Hugo',
      title: 'Le quartier a ses habitudes.',
      category: 'Bar',
      district: 17,
      address: '54 rue des Dames, 75017 Paris',
      startsAt: now + 300 * 60000,
      seats: 1,
      price: 2000,
      womenOnly: false,
      description:
        'Près du Bistrot des Dames, une pause dans les Batignolles. J’arrive à pied après le travail ; si vous aimez parler architecture, musique ou simplement de votre journée, cette chaise est pour vous. Lieu et disponibilité à confirmer, invitation fictive.',
    },
  ];
}
