import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { getIconSymbol, Icon } from '@/components/ui/icon';
import { BorderRadius, LayoutSpacing, LightColors, Shadows, Typography } from '@/constants/theme';

export type InputProps = Pick<
  TextInputProps,
  | 'placeholder'
  | 'maxLength'
  | 'keyboardType'
  | 'secureTextEntry'
  | 'returnKeyType'
  | 'onSubmitEditing'
  | 'onFocus'
  | 'onBlur'
  | 'autoFocus'
  | 'autoCorrect'
  | 'autoCapitalize'
  | 'accessibilityLabel'
> & {
  value: string;
  onChangeText: (text: string) => void;
  rightIcon?: string;
  rightIconAccessibilityLabel?: string;
  onRightIconPress?: () => void;
  disabled?: boolean;
  helperText?: string;
  error?: boolean;
};

export function Input({
  rightIcon,
  rightIconAccessibilityLabel,
  onRightIconPress,
  disabled = false,
  helperText,
  error = false,
  onFocus,
  onBlur,
  ...inputProps
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const showFocus = focused && !disabled;
  const symbol = rightIcon ? getIconSymbol(rightIcon) : undefined;
  const hasRightIconAction = !!onRightIconPress;

  return (
    <View style={styles.root}>
      <View style={[styles.container, disabled ? styles.disabled : showFocus ? Shadows.inputFocus : Shadows.surface]}>
        <TextInput
          {...inputProps}
          style={[styles.input, disabled && styles.disabledText]}
          placeholderTextColor={LightColors.placeholder}
          editable={!disabled}
          aria-disabled={disabled}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          multiline={false}
          underlineColorAndroid="transparent"
        />
        <View style={styles.iconSlot}>
          {symbol && (
            <Pressable
              accessibilityRole={hasRightIconAction ? 'button' : undefined}
              accessibilityLabel={hasRightIconAction ? rightIconAccessibilityLabel : undefined}
              accessible={hasRightIconAction}
              aria-disabled={hasRightIconAction ? disabled : undefined}
              disabled={!hasRightIconAction || disabled}
              onPress={onRightIconPress}
              style={styles.iconSlot}>
              <Icon
                symbol={symbol}
                size={LayoutSpacing.xl}
                color={disabled ? LightColors.textSecondary : LightColors.primary}
              />
            </Pressable>
          )}
        </View>
        {showFocus && <View pointerEvents="none" style={styles.focusBorder} />}
      </View>
      {!!helperText && <Text style={[styles.helper, error && styles.error]}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%' },
  container: {
    height: LayoutSpacing.xl * 2,
    borderRadius: BorderRadius.full,
    backgroundColor: LightColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LayoutSpacing.lg,
    gap: LayoutSpacing.sm,
  },
  focusBorder: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderColor: LightColors.primary,
    borderRadius: BorderRadius.full,
  },
  input: {
    ...Typography.body,
    flex: 1,
    minWidth: 0,
    height: '100%',
    padding: 0,
    color: LightColors.text,
    textAlign: 'left',
    textAlignVertical: 'center',
    includeFontPadding: false,
    outlineWidth: 0,
  },
  iconSlot: {
    width: LayoutSpacing.xl,
    height: LayoutSpacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { backgroundColor: LightColors.buttonDisabled },
  disabledText: { color: LightColors.textSecondary },
  helper: {
    ...Typography.caption,
    color: LightColors.textSecondary,
    marginTop: LayoutSpacing.sm,
    marginHorizontal: LayoutSpacing.lg,
  },
  error: { color: LightColors.error },
});
