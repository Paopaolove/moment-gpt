import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';
import { Moment } from '../domain/rules';
import { c, medium, serif } from '../theme/tokens';
import { feedback } from './haptics';
import { Sticker } from './Funky';
import { useReducedMotion } from './useReducedMotion';
export function Roulette({ moments, onOpen }: { moments: Moment[]; onOpen: (m: Moment) => void }) {
 const [target, setTarget] = useState<Moment | null>(null);
 const [stops, setStops] = useState(0);
 const [tick, setTick] = useState(0);
 const reduced = useReducedMotion();
 const shift = useRef(new Animated.Value(0)).current;
 useEffect(() => {
  if (!target) return;
  setStops(0);
  const loop = Animated.loop(Animated.timing(shift, {toValue: 1, duration: 110, useNativeDriver:true}));
  if (!reduced) loop.start();
  const interval = reduced ? undefined : setInterval(() => setTick(t => t + 1), 85);
  const timers = [0,1,2].map(i => setTimeout(() => { setStops(i + 1); void feedback('selection'); }, (reduced ? 200 : 850) + i * (reduced ? 200 : 600)));
  return () => {loop.stop(); if(interval) clearInterval(interval); timers.forEach(clearTimeout);};
 }, [target, reduced, shift]);
 const time = (m: Moment) => new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',hour:'2-digit',minute:'2-digit'}).format(m.startsAt);
 return <><Pressable accessibilityRole="button" disabled={!moments.length} accessibilityLabel="Surprends-moi, choisir une place au hasard" onPress={() => setTarget(moments[Math.floor(Math.random()*moments.length)] ?? null)}><Sticker shape="scallop" color={c.pink}><Text style={{fontFamily:serif,fontSize:30,color:c.ink,textAlign:'center'}}>Surprends-moi ↗</Text><Text style={{fontFamily:medium,fontSize:14,color:c.ink,textAlign:'center'}}>LE HASARD A BON GOÛT.</Text></Sticker></Pressable>
 <Modal visible={!!target} transparent animationType="fade" onRequestClose={() => setTarget(null)}><View style={{flex:1,backgroundColor:'#24082FEE',justifyContent:'center',padding:24}}><View accessibilityViewIsModal style={{width:'100%',maxWidth:480,alignSelf:'center',backgroundColor:c.card,padding:20,gap:24,borderWidth:5,borderColor:c.pink}}><Text style={{fontFamily:serif,fontSize:36,color:c.ink}}>Le grand tirage !</Text><Text style={{fontFamily:medium,color:c.muted,fontSize:14}}>CATÉGORIE · ARRONDISSEMENT · HEURE</Text><View style={{flexDirection:'row',gap:6}}>{[0,1,2].map(i => {const m = stops > i ? target : moments[tick % Math.max(1,moments.length)]; return <View key={i} style={{flex:1,height:72,overflow:'hidden',backgroundColor:c.yellow,justifyContent:'center'}}><Animated.Text style={{textAlign:'center',fontFamily:medium,fontSize:19,color:c.ink,transform: reduced || stops > i ? [] : [{translateY:shift.interpolate({inputRange:[0,1],outputRange:[-22,22]})}]}}>{m ? [m.category,`${m.district}e`,time(m)][i] : '—'}</Animated.Text></View>;})}</View><Text accessibilityLiveRegion="polite" style={{fontFamily:serif,color:c.ink,fontSize:24}}>{stops === 3 ? target?.title : 'Paris mélange les cartes…'}</Text>{stops === 3 && <Pressable accessibilityRole="button" onPress={() => { const current = moments.find(m => m.id === target?.id); if(current) onOpen(current); setTarget(null); }} style={{backgroundColor:c.blue,padding:18}}><Text style={{fontFamily:medium,color:c.light,textAlign:'center',fontSize:16}}>C’est mon billet ↗</Text></Pressable>}<Pressable accessibilityRole="button" onPress={() => setTarget(null)}><Text style={{fontFamily:medium,color:c.ink,fontSize:16}}>Fermer</Text></Pressable></View></View></Modal></>;
}
