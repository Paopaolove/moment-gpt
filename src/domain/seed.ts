import { parisTime, nextSlot } from './parisTime';
import type { Booking, Category, Moment } from './rules';
import { isUrgent } from './rules';
export function seed(now: number): Moment[] {
  const rows: [
    string,
    Category,
    string,
    string,
    number,
    string,
    number,
    number,
    number,
    boolean,
    string
  ][] = [
      ['Bistrot Paul Bert', 'Table', 'Bistrot', 'Camille', 11, '18 rue Paul Bert, 75011 Paris', 55, 2, 3000, false, 'Une table réservée, une chaise de libre. Je vous invite à hauteur de 30 € ; le supplément éventuel reste à votre charge.'],
      ['La quatrième raquette', 'Sport', 'Padel', 'Samir', 20, '4 rue Louis Lumière, 75020 Paris', 80, 1, 2000, false, 'Double amical au centre Louis-Lumière. Niveau loisir, matériel à prévoir. Créneau et terrain simulés pour ce prototype.'],
      ['Un film au Champo', 'Culture', 'Cinéma', 'Jeanne', 5, '51 rue des Écoles, 75005 Paris', 35, 1, 1000, false, 'Une séance de répertoire et un siège voisin. On choisit le film sur place. Programmation fictive.'],
      ['Un tour aux Buttes', 'Sport', 'Footing', 'Nora', 19, '1 rue Botzaris, 75019 Paris', 120, 3, 1000, true, 'Rendez-vous à la grille Botzaris. Cinq kilomètres tranquilles, puis une boisson offerte. Femmes uniquement.'],
      ['Nager sur la Seine', 'Sport', 'Piscine', 'Alex', 13, 'Quai François Mauriac, 75013 Paris', 160, 2, 1000, false, 'Piscine Joséphine-Baker : quelques longueurs à son rythme. Invitation pour l’entrée, bonnet nécessaire.'],
      ['Le siège d’à côté', 'Culture', 'Concert', 'Gabriel', 19, '221 avenue Jean Jaurès, 75019 Paris', 190, 1, 4000, false, 'Un billet en plus à la Philharmonie. Une soirée pour écouter ensemble. Concert et disponibilité simulés.'],
      ['Une autre perspective', 'Culture', 'Exposition', 'Lou', 16, '13 avenue du Président Wilson, 75016 Paris', 75, 2, 2000, false, 'Palais de Tokyo. On parcourt les salles et on prend le temps de regarder. Entrée offerte.'],
      ['Le théâtre à deux', 'Culture', 'Théâtre', 'Émile', 6, 'Place de l’Odéon, 75006 Paris', 240, 1, 4000, false, 'Une place voisine à l’Odéon. Représentation fictive pour découvrir le parcours.'],
      ['La table du quartier', 'Table', 'Cuisine française', 'Sarah', 11, '80 rue de Charonne, 75011 Paris', 210, 3, 3000, true, 'Au Bistrot des Fées, des assiettes de saison et trois places à partager. Femmes uniquement.'],
    ];
  const slots = [['19:30', '20:30', '21:00'], ['12:30', '19:00'], ['20:15'], ['08:00', '19:00'], ['12:30'], ['20:00'], ['18:30'], ['20:00'], ['19:30', '20:30', '21:00']];
  const moments: Moment[] = rows.map(([title, category, subtype, host, district, address, minutes, seats, price, womenOnly, description], i) => ({ id: `place-${i}`, hostId: `host-${i}`, title, category, subtype, host, district, address, startsAt: nextSlot(now, slots[i]!), seats, price, womenOnly, description }));
  if(!moments.some(m => isUrgent(m.startsAt, now))) {
    const hour = Number(new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', hourCycle: 'h23' }).format(now));
    const evening = hour >= 17 && hour < 23;
    const daytime = hour >= 7 && hour < 17;
    moments.push({
      id: 'place-9', hostId: 'host-9',
      title: evening ? 'Un verre au Perchoir' : daytime ? 'Un café au Café de Flore' : 'Une soupe au Pied de Cochon',
      category: 'Table', subtype: evening ? 'Terrasse' : 'Bistrot', host: 'Claude',
      district: evening ? 11 : daytime ? 6 : 1,
      address: evening ? '14 rue Crespin du Gast, 75011 Paris' : daytime ? '172 boulevard Saint-Germain, 75006 Paris' : '6 rue Coquillière, 75001 Paris',
      startsAt: Math.ceil(now / 900000) * 900000, seats: 1, price: 1000, womenOnly: false,
      description: 'Une place à partager et une invitation de 10 €. Disponibilité fictive pour cette démonstration.'
    });
  }
  return moments;
}

/** Souches de démonstration, indépendantes des transitions métier. */
export function seedHistory(_now: number): { moments: Moment[]; bookings: Booking[] } {
  const moments: Moment[] = [
    { title: 'Un café à Saint-Germain', district: 6, address: '172 boulevard Saint-Germain, 75006 Paris' },
    { title: 'Une table rue Paul Bert', district: 11, address: '18 rue Paul Bert, 75011 Paris' },
    { title: 'Après le concert', district: 19, address: '221 avenue Jean Jaurès, 75019 Paris' }
  ].map((place, i) => ({
    ...place, id: `demo-past-${i + 1}`, hostId: `demo-host-${i + 1}`, host: ['Jeanne', 'Camille', 'Gabriel'][i]!,
    category: 'Table', subtype: 'Bistrot', startsAt: parisTime(['2026-09-25', '2026-09-18', '2026-09-11'][i]!, ['12:30', '19:00', '20:00'][i]!),
    seats: 1, price: 1000, womenOnly: false, description: 'Souche passée de démonstration.'
  }));
  return { moments, bookings: moments.map(m => ({ momentId: m.id, guestId: 'me', status: 'present', deposit: 'released' })) };
}
