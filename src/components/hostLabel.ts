const names = ['Julien', 'Sarah', 'Le Café', 'Louise', 'Thomas', 'Léa', 'Gabriel', 'Alice', 'Hugo', 'Emma'];
export function hostLabel(id: string, name?: string) {
  if(name && name !== id)
    return name;
  const index = id.match(/(?:^|-)host-(\d+)$/)?.[1];
  return index === undefined ? 'Votre hôte' : names[Number(index)] ?? 'Votre hôte';
}
