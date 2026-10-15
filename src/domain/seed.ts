import type { Moment, Category } from './rules';
export function seed(now: number): Moment[] {
 const rows: [string, Category, string, string, number, string, number, number, number, boolean, string][] = [
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
 return rows.map(([title,category,subtype,host,district,address,minutes,seats,price,womenOnly,description], i) => ({id:`place-${i}`,hostId:`host-${i}`,title,category,subtype,host,district,address,startsAt:now+minutes*60000,seats,price,womenOnly,description}));
}
