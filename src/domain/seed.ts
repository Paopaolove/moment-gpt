import type { Moment } from './rules';
export function seed(now: number): Moment[] {
  return [
    { id: '1', title: 'Une table, deux histoires', category: 'Resto', host: 'Camille', district: 11, address: '18 rue Paul Bert, Paris', startsAt: now + 60 * 60000, seats: 2, price: 3000, womenOnly: false, description: 'Un petit bistrot de quartier, une cuisine de saison et le plaisir de rencontrer de nouvelles personnes. On partage une table, simplement.' },
    { id: '2', title: 'Paris au fil de l’eau', category: 'Balade', host: 'Léa', district: 4, address: 'Place Louis-Aragon, Paris', startsAt: now + 180 * 60000, seats: 3, price: 0, womenOnly: true, description: 'Une promenade sur les quais de Seine, sans itinéraire trop précis. Des chaussures confortables et un peu de curiosité suffisent.' },
    { id: '3', title: 'L’heure du premier verre', category: 'Bar', host: 'Thomas', district: 10, address: '36 rue de la Grange aux Belles, Paris', startsAt: now + 10 * 60000, seats: 1, price: 2000, womenOnly: false, description: 'Une terrasse près du canal, un verre et une conversation. Avec ou sans alcool, chacun choisit.' },
    { id: '4', title: 'Un dimanche au musée', category: 'Culture', host: 'Inès', district: 3, address: '5 rue de Thorigny, Paris', startsAt: now + 24 * 60 * 60000, seats: 2, price: 1600, womenOnly: false, description: 'Prendre le temps de regarder une exposition, puis échanger nos impressions dans la cour.' }
  ];
}
