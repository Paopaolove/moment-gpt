/** Paris calendar dates and wall times, independent of the device timezone. */
export const parisDay = (now: number) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Paris' }).format(now);
export function addDays(day: string, days: number) {
  return new Date(Date.parse(`${day}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
}
export function parisTime(day: string, hour: string) {
  const wall = Date.parse(`${day}T${hour}:00Z`);
  const rendered = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(wall);
  return wall - (Date.parse(rendered.replace(' ', 'T') + ':00Z') - wall);
}
export function nextSlot(now: number, hours: string[]) {
  const day = parisDay(now);
  return hours.map(hour => parisTime(day, hour)).find(time => time > now) ?? parisTime(addDays(day, 1), hours[0]!);
}
export const offerHours = ['08:00', '12:30', '18:30', '19:00', '19:30', '20:00', '20:15', '20:30', '21:00'];
