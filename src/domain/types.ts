/** All monetary values are integer cents; all instants are epoch milliseconds. */
export type Category = 'Table' | 'Verre' | 'Sport' | 'Culture';
export type Level = 1 | 3 | 5;
export type User = {
  id: string; name: string; role: 'particulier' | 'partenaire' | 'visiteur';
  accountStatus: 'active' | 'closed'; woman: boolean; absences: number;
  hostWarnings: number; priority: boolean; jokerMonths: string[];
  credits: Credit[]; honoredMoments: number; momentRatings: Level[];
};
export type Partner = { id: string; owner: string; status: 'en_revue' | 'valide'; gesture: string; discountPercent: number };
export type Moment = {
  id: string; title: string; category: Category; neighborhood: string; district: number;
  privateAddress: string; accessDetails?: string; startsAt: number; endsAt: number;
  seats: 1 | 2 | 3; invitationCents: number; freeAmountCents?: number;
  femmesUniquement: boolean; hostId: string; partnerId?: string; urgent: boolean;
  status: 'active' | 'closed' | 'cancelled'; hostPresentAt?: number;
};
export type Deposit = 'held' | 'released' | 'forfeited' | 'none';
export type Request = { id: string; momentId: string; guestId: string; status: 'requested' | 'accepted' | 'confirmed' | 'expired' | 'cancelled' | 'declined'; deposit: Deposit; requestedAt: number; acceptedAt?: number; confirmedAt?: number; presentAt?: number };
export type Credit = { id: string; owner: string; cents: number; consumed: boolean };
export type Unexpected = { id: string; momentId: string; requestId: string; sender: string; recipient: string; phrase: string; status: 'pending' | 'accepted' | 'declined'; createdAt: number };
export type Rating = { id: string; momentId: string; author: string; recipient: string; momentLevel: Level; venueLevel: Level };
export type Photo = { id: string; momentId: string; author: string; type: 'lieu' | 'table'; uri: string; people: string[]; consent: string[] };
export type Draft = Omit<Moment, 'id' | 'status' | 'hostPresentAt'>;
