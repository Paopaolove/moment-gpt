import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
export async function feedback(kind: 'selection' | 'stamp' | 'success' | 'warning') {
  if(Platform.OS === 'web')
    return;
  try {
    if(kind === 'selection')
      await Haptics.selectionAsync();
    else if(kind === 'stamp')
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else
      await Haptics.notificationAsync(kind === 'success' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
  }
  catch { /* Haptics are optional on unsupported devices. */ }
}
