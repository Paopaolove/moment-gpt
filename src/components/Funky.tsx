import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { c, categoryColor, medium, serif } from '../theme/tokens';
import { Category } from '../domain/rules';
import { useReducedMotion } from './useReducedMotion';

function usePhase(duration = 8000) {
  const reduced = useReducedMotion();
  const phase = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    phase.setValue(0);
    if (reduced) return;
    const loop = Animated.loop(Animated.timing(phase, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true }));
    loop.start(); return () => loop.stop();
  }, [reduced, duration, phase]);
  return { phase, reduced };
}
export function Sticker({ children, shape = 'round', color = c.yellow, size = 210, spin = false }: { size?: number; spin?: boolean; children: React.ReactNode; shape?: 'round' | 'star' | 'scallop'; color?: string }) {
  const { phase } = usePhase(60000);
  return <Animated.View style={{ alignSelf: 'center', width: size, height: size, margin: 12, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: spin ? phase.interpolate({inputRange:[0,1],outputRange:['-5deg','355deg']}) : '-8deg' }] }}>
    {shape !== 'round' && Array.from({length: shape === 'star' ? 12 : 20}, (_, i) => <View pointerEvents="none" key={i} style={{position:'absolute',width:size * (shape === 'star' ? .75 : .895),height:size * (shape === 'star' ? .75 : .895),borderRadius:shape === 'star' ? 4 : 65,backgroundColor:color,transform:[{rotate:`${i * (shape === 'star' ? 15 : 18)}deg`}]}} />)}
    <View style={{position:'absolute',width:size*.924,height:size*.924,borderRadius:100,backgroundColor:color}} />
    <View style={{width:size*.86,alignItems:'center'}}>{children}</View>
  </Animated.View>;
}
export function Marquee({ text = 'PLACE LIBRE · PLACE LIBRE · ON SORT ? · ' }: { text?: string }) {
  const { phase } = usePhase(14000);
  const [width, setWidth] = React.useState(0);
  return <View accessibilityLabel={text} style={{height:45,backgroundColor:c.yellow,overflow:'hidden',transform:[{rotate:'-3deg'}],marginHorizontal:-30,marginVertical:12}}>
    <Animated.View accessibilityElementsHidden style={{flexDirection:'row',width:10000,transform:[{translateX:phase.interpolate({inputRange:[0,1],outputRange:[0,-width]})}]}}>
      {[0,1].map(i => <Text key={i} onLayout={i === 0 ? e => setWidth(e.nativeEvent.layout.width) : undefined} style={{flexShrink:0,fontFamily:medium,fontSize:24,lineHeight:44,color:c.ink}}>{text.repeat(4)}</Text>)}
    </Animated.View>
  </View>;
}
export function SunsetGradient() {
  const { phase } = usePhase(12000);
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>{[c.accent, c.pink, c.paper].map((color, i) => <Animated.View key={color} style={{ position: 'absolute', backgroundColor: color, opacity: 0.55, borderRadius: 200, width: '180%', height: 320, left: '-40%', top: i * 130 - 80, transform: [{ translateY: phase.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 28 * (i + 1), 0] }) }] }} />)}</View>;
}
export function DiscoBall() {
  const { phase } = usePhase(10000);
  return <View accessibilityLabel="Boule à facettes" style={{ height: 80, alignItems: 'center' }}><View style={{ height: 8, width: 2, backgroundColor: c.light }} /><View style={{ width: 64, height: 64, borderRadius: 32, overflow: 'hidden', flexDirection: 'row', flexWrap: 'wrap', backgroundColor: c.blue }}>{Array.from({ length: 64 }, (_, i) => <View key={i} style={{ width: 8, height: 8, borderWidth: 1, borderColor: c.paper, backgroundColor: [c.light, c.pink, c.blue, c.yellow][(i * 7 + Math.floor(i / 8)) % 4] }} />)}</View><Animated.View pointerEvents="none" style={{ position: 'absolute', top: 35, transform: [{ rotate: phase.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>{[0, 90, 180, 270].map(n => <Text key={n} style={{ position: 'absolute', color: c.yellow, fontSize: 26, transform: [{ rotate: `${n}deg` }, { translateX: 100 }] }}>✦</Text>)}</Animated.View></View>;
}
export function Confetti({ category }: { category: Category }) {
  const reduced = useReducedMotion();
  const { height } = useWindowDimensions();
  const fall = useRef(new Animated.Value(0)).current;
  useEffect(() => { if (reduced) return; fall.setValue(0); const a = Animated.timing(fall, { toValue: 1, duration: 1800, useNativeDriver: true }); a.start(); return () => a.stop(); }, [fall, reduced]);
  if (reduced) return null;
  return <View pointerEvents="none" accessibilityElementsHidden style={[StyleSheet.absoluteFill, { overflow: 'hidden', zIndex: 100, elevation: 100 }]}>{Array.from({ length: 48 }, (_, i) => <Animated.View key={i} style={{ position: 'absolute', left: `${i * 37 % 100}%`, top: -30 - i * 4, width: 6 + i % 5, height: 12, backgroundColor: [categoryColor[category], c.yellow, c.blue, c.pink][i % 4], opacity: fall.interpolate({ inputRange: [0, 0.75, 1], outputRange: [1, 1, 0] }), transform: [{ translateY: fall.interpolate({ inputRange: [0, 1], outputRange: [0, height + 240 + i * 4] }) }, { rotate: fall.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${i % 2 ? 540 : -540}deg`] }) }] }} />)}</View>;
}
export function Entrance({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
 const reduced = useReducedMotion(); const v = useRef(new Animated.Value(0)).current;
 useEffect(() => { const a = Animated.timing(v, { toValue: 1, delay: reduced ? 0 : Math.min(index * 90, 600), duration: 450, useNativeDriver: true }); a.start(); return () => a.stop(); }, [v, reduced, index]);
 return <Animated.View style={{ opacity: v, transform: reduced ? [] : [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [45, 0] }) }, { rotate: v.interpolate({ inputRange: [0, 1], outputRange: [index % 2 ? '4deg' : '-4deg', '0deg'] }) }] }}>{children}</Animated.View>;
}
export function Opening({ children }: { children: React.ReactNode }) {
 const reduced = useReducedMotion(); const v = useRef(new Animated.Value(0)).current;
 useEffect(() => { v.setValue(0); const a = Animated.timing(v, { toValue: 1, duration: reduced ? 350 : 1500, useNativeDriver: true }); a.start(); return () => a.stop(); }, [v, reduced]);
 return <View style={{ overflow: 'hidden' }}><SunsetGradient /><Animated.View style={{ opacity: v, transform: reduced ? [] : [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [-180, 0] }) }] }}><DiscoBall />{children}</Animated.View>{!reduced && <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: c.blue, flexDirection: 'row', transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -1500] }) }] }]}>{Array.from({length: 16}, (_, i) => <View key={i} style={{ flex: 1, borderRightWidth: 5, borderColor: '#2422A0', borderBottomLeftRadius: 14, borderBottomRightRadius: 14 }} />)}</Animated.View>}</View>;
}
export function FlyingStub({ children }: { children: React.ReactNode }) {
 const reduced = useReducedMotion(); const v = useRef(new Animated.Value(0)).current;
 useEffect(() => { v.setValue(0); const a = Animated.timing(v, {toValue:1,duration:reduced ? 350 : 1800,useNativeDriver:true}); a.start(); return () => a.stop(); }, [reduced,v]);
 const parts = React.Children.toArray(React.isValidElement<{children: React.ReactNode}>(children) ? children.props.children : children);
 return <View><Animated.View style={{transform:reduced ? [] : [{translateY:v.interpolate({inputRange:[0,.2,.7,1],outputRange:[0,-14,-14,0]})}]}}>{parts[0]}</Animated.View>
 <Animated.View style={{opacity:reduced ? v : 1,transform:reduced ? [] : [{translateX:v.interpolate({inputRange:[0,.25,.6,1],outputRange:[0,24,80,0]})},{translateY:v.interpolate({inputRange:[0,.2,.6,1],outputRange:[0,20,-160,0]})},{rotate:v.interpolate({inputRange:[0,.2,.65,1],outputRange:['0deg','-8deg','28deg','0deg']})}]}}>
 <View style={{height:12,flexDirection:'row',justifyContent:'space-between'}}>{Array.from({length:24},(_,i)=><View key={i} style={{width:10,height:10,backgroundColor:c.card,transform:[{rotate:'45deg'}]}} />)}</View>{parts.slice(1)}</Animated.View></View>;
}
