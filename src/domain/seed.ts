import type { Moment } from './rules';
export function seed(now: number): Moment[] {
    return [
        { id: 'paul', hostId: 'camille', title: 'La grande petite table.', category: 'Resto', host: 'Camille', district: 11, address: '18 rue Paul Bert, 75011 Paris', startsAt: now + 60 * 60000, seats: 2, price: 3000, womenOnly: false, description: 'Un bistrot de quartier, une cuisine de saison. On commande, on partage, on refait un petit bout du monde. Venez comme vous êtes.' },
        { id: 'canal', hostId: 'thomas', title: 'Un verre au bord du canal.', category: 'Bar', host: 'Thomas', district: 10, address: '36 rue de la Grange aux Belles, 75010 Paris', startsAt: now + 10 * 60000, seats: 1, price: 2000, womenOnly: false, description: 'La lumière sur le canal et une table en terrasse. Avec ou sans alcool : juste le plaisir de faire connaissance.' },
        { id: 'filles', hostId: 'ines', title: 'Le jeudi a meilleur goût.', category: 'Resto', host: 'Inès', district: 3, address: '9 rue de Bretagne, 75003 Paris', startsAt: now + 1440 * 60000, seats: 3, price: 4000, womenOnly: true, description: 'Un dîner entre femmes, des assiettes à partager et aucune raison de se presser. Une parenthèse dans la semaine.' },
    ];
}
