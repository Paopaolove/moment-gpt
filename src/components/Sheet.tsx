import React from 'react';
import { Motion } from './Motion';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { s } from '../components/styles';
import { T } from '../components/T';
import { colors as c } from '../theme/tokens';
export function Sheet({ title, visible, onClose, children, footer }: {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#11111155'
      }}>
      <Pressable accessibilityLabel="Fermer" onPress={onClose} style={{ flex: 1 }} />
      <Motion
        key={String(visible)}
        accessibilityViewIsModal
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 24,
          maxHeight: '85%',
          width: '100%',
          maxWidth: 680,
          alignSelf: 'center'
        }}>
        <View style={s.between}>
          <T style={s.title}>
            {title}
          </T>
          <Button title="Fermer" variant="text" onPress={onClose} />
        </View>
        <ScrollView
          style={{ flexShrink: 1 }}
          contentContainerStyle={{
            gap: 16, paddingVertical: 20, paddingBottom: 16
          }}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        {footer && <View
          style={{
            paddingTop: 16,
            paddingBottom: Math.max(12, insets.bottom),
            borderTopWidth: 1,
            borderColor: c.border
          }}>
          {footer}
        </View>}
      </Motion>
    </View>
  </Modal>;
}
