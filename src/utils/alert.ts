import { Alert, Platform } from 'react-native';

export function showAlert(...args: Parameters<typeof Alert.alert>): void {
  if (Platform.OS !== 'web') {
    Alert.alert(...args);
    return;
  }

  if (typeof window === 'undefined') return;

  const [title, message, buttons, options] = args;
  if (options && Object.keys(options).length > 0) {
    console.warn('showAlert: native Alert options are not supported on Web.');
    return;
  }
  if (buttons?.some((button) => button.isPreferred)) {
    console.warn('showAlert: preferred buttons are not supported on Web.');
    return;
  }

  const text = [title, message].filter(Boolean).join('\n\n');
  if (!buttons || buttons.length === 1) {
    window.alert(text);
    buttons?.[0].onPress?.();
    return;
  }

  if (buttons.length !== 2) {
    console.warn('showAlert: Web requires one button or a confirmation pair.');
    return;
  }

  const cancel = buttons.filter((button) => button.style === 'cancel');
  if (cancel.length !== 1) {
    console.warn('showAlert: a Web confirmation requires exactly one cancel button.');
    return;
  }

  const confirm = buttons.find((button) => button.style !== 'cancel');
  (window.confirm(text) ? confirm : cancel[0])?.onPress?.();
}
