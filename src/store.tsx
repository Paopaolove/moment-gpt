import React, {createContext,useContext,useEffect,useReducer,useState} from 'react';
import {reducer, Action} from './domain/reducer';
import {seedState} from './domain/seed';
import * as Haptics from 'expo-haptics';
type Input = Action extends infer A ? A extends Action ? Omit<A,'now'|'actor'> & {actor?:string} : never : never;
function useModel(){
 const [origin] = useState(()=>Date.now());
 const [now,setNow]=useState(origin);
 const [state,dispatch]=useReducer(reducer,origin,seedState);
 useEffect(()=>{const id=setInterval(()=>setNow(t=>t+1000),1000);return()=>clearInterval(id)},[]);
 useEffect(()=>dispatch({type:'tick',now,actor:'guest'}),[now]);
 const user=state.users.find(u=>u.id===state.signedInId)??null;
 function act(action: Input){dispatch({...action,now,actor:action.actor??user?.id??'guest'} as Action);if(['confirm','markPresence','publish'].includes(action.type)) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(()=>{});}
 return {state,user,now,setNow,act,dispatch};
}
const Context=createContext<ReturnType<typeof useModel>|null>(null);
export function Provider({children}:{children:React.ReactNode}){return <Context.Provider value={useModel()}>{children}</Context.Provider>}
export function useStore(){const v=useContext(Context);if(!v)throw Error('Provider manquant');return v;}
