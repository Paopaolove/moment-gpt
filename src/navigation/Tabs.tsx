import { Pressable, View } from 'react-native';
import { Icon, IconName } from '../components/Icon';
import { T } from '../components/T';
import { colors as c } from '../theme/tokens';
export function TabBar({ tab, onChange }: {
  tab: string;
  onChange: (v: string) => void;
}) {
  return <View
    style={{
      flexDirection: 'row',
      borderTopWidth: 1,
      borderColor: c.border,
      backgroundColor: 'white',
      paddingTop: 8,
      paddingBottom: 8
    }}>
    {[['Découvrir', 'compass'], ['Mes moments', 'calendar'], ['Publier', 'plus'], ['Profil', 'person']].map(([name, icon]) => <Pressable
      key={name}
      accessibilityRole="tab"
      accessibilityLabel={name}
      accessibilityState={{ selected: tab === name }}
      onPress={() => onChange(name!)}
      style={{
        flex: 1,
        minHeight: 56,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3
      }}>
      <Icon name={icon as IconName} active={tab === name} color={tab === name ? c.text : c.secondary} />
      <T
        style={{
          fontSize: 11,
          lineHeight: 16,
          color: tab === name ? c.text : c.secondary,
          fontFamily: tab === name ? 'InterTight_600SemiBold' : 'InterTight_400Regular'
        }}>
        {name}
      </T>
    </Pressable>)}
  </View>;
}
