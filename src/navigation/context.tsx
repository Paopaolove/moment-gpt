import { createContext, useContext } from 'react';
export type Route = 'Onboarding' | 'Fil' | 'Detail' | 'Dispo' | 'Publier' | 'Demandes' | 'Confirmation' | 'Chat' | 'Joker' | 'Abonnements' | 'Profil' | 'Avis' | 'Lieu' | 'Carte';
export type Location = {
    name: Route;
    id?: string;
};
export const FlowContext = createContext<{
    route: Location;
    go: (name: Route, id?: string) => void;
    back: () => void;
}>({ route: { name: 'Onboarding' }, go: () => { }, back: () => { } });
export const useFlow = () => useContext(FlowContext);
