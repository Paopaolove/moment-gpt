import type { Moment, User, Partner, Category } from './types';
import { nextSlot } from './parisTime';
import { initialState } from './reducer';
export const demoUser = (id: string, name = id): User => ({ id, name, role: 'particulier', accountStatus: 'active', woman: false, absences: 0, hostWarnings: 0, priority: true, jokerMonths: [], credits: [], honoredMoments: 0, momentRatings: [] });
export const demoPartner: Partner = { id: 'cafe', owner: 'host-2', status: 'valide', gesture: 'Un café offert après le déjeuner', discountPercent: 15 };
export function seed(now: number): Moment[] {
  const rows: [string, Category, string, number, string, string[]][] = [
    ['Une table chez Paul Bert', 'Table', 'Sainte-Marguerite', 11, '18 rue Paul Bert, 75011 Paris', ['19:30', '20:30']],
    ['Un verre près du canal', 'Verre', 'Porte-Saint-Martin', 10, '48 quai de Jemmapes, 75010 Paris', ['18:30', '19:30']],
    ['Déjeuner et café offert', 'Table', 'Saint-Germain-des-Prés', 6, '172 boulevard Saint-Germain, 75006 Paris', ['12:30']],
    ['Footing aux Buttes', 'Sport', 'Combat', 19, '1 rue Botzaris, 75019 Paris', ['08:00', '18:30']],
    ['Une séance au Champo', 'Culture', 'Sorbonne', 5, '51 rue des Écoles, 75005 Paris', ['20:15']],
    ['Un verre à Oberkampf', 'Verre', 'Folie-Méricourt', 11, '109 rue Oberkampf, 75011 Paris', ['19:00']],
    ['Quelques longueurs', 'Sport', 'Gare', 13, 'Quai François Mauriac, 75013 Paris', ['12:30']],
    ['Une exposition ensemble', 'Culture', 'Chaillot', 16, '13 avenue du Président Wilson, 75016 Paris', ['18:30']],
    ['Dîner près du marché', 'Table', 'Aligre', 12, '1 rue Théophile Roussel, 75012 Paris', ['20:00']],
    ['Un concert à partager', 'Culture', 'Pont-de-Flandre', 19, '221 avenue Jean Jaurès, 75019 Paris', ['20:00']],
  ];
  const moments: Moment[] = rows.map(([title, category, neighborhood, district, privateAddress, hours], i) => {
    const startsAt = nextSlot(now, hours);
    return { id: `moment-${i}`, title, category, neighborhood, district, privateAddress, startsAt, endsAt: startsAt + 90 * 60000, seats: 2, invitationCents: 2000, femmesUniquement: i === 3, hostId: `host-${i}`, partnerId: i === 2 ? demoPartner.id : undefined, urgent: false, status: 'active' };
  });
  // At any demo clock, two immediately available invitations. Night slots use a late-night venue.
  const hour = Number(new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', hourCycle: 'h23' }).format(now));
  const night = hour < 7 || hour >= 23;
  for (let i = 0; i < 2; i++) {
    const startsAt = Math.ceil(now / 900000) * 900000 + i * 15 * 60000;
    moments.push({ id: `urgent-${i}`, title: night ? 'Une soupe tardive au Pied de Cochon' : i ? 'Un café, déjà sur place' : 'Une pause à partager', category: i ? 'Verre' : 'Table', neighborhood: 'Les Halles', district: 1, privateAddress: '6 rue Coquillière, 75001 Paris', startsAt, endsAt: startsAt + 60 * 60000, seats: 1, invitationCents: 1000, femmesUniquement: false, hostId: `urgent-host-${i}`, urgent: true, status: 'active' });
  }
  return moments;
}
export function seedState(now: number) {
  const moments = seed(now);
  const users = moments.map(m => demoUser(m.hostId));
  users.find(u => u.id === demoPartner.owner)!.role = 'partenaire';
  return initialState(moments, [...users, demoUser('guest', 'Camille')], [{ ...demoPartner }]);
}
