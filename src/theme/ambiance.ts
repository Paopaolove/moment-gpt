const bulletins = [
 'Éclaircies royales. Couronne facultative.', 'Pression des petits plats en hausse.',
 'Fort potentiel de débat sur la meilleure boulangerie.', 'Brise de Seine, grand vent de théâtre.',
 'Averses de sous-titres. Parapluie inutile.', 'Un soleil littéraire, avec supplément terrasse.',
 'Tour Eiffel au beau fixe. Vous aussi, bientôt.', 'Rafales de chic. Écharpe dramatique conseillée.',
 'Grêle de rappels. Le dernier morceau sera le meilleur.', 'Canal calme, conversations à gros débit.',
 '90 % de chances de refaire le monde.', 'Anticyclone de grandes tablées.',
 'Ciel dégagé pour les idées XXL.', 'Les astres recommandent une chaise de plus.',
 'Soleil de quartier, indice convivialité maximal.', 'Brise distinguée, fous rires indisciplinés.',
 'Une éclaircie entre deux « on se fait ça ? ».', 'Montée des températures et des escaliers.',
 'Vagues de bonne humeur sur les Buttes.', 'Belleville au zénith. Encore un petit rappel ?'
];
export const ambiance = (district: number) => `${district === 1 ? '1er' : `${district}e`} : ${bulletins[district - 1] ?? bulletins[0]}`;
