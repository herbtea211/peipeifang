import { Fragment } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, LayoutSpacing, LightColors, Shadows, Typography } from '@/constants/theme';

export type MenuItem = {
  id: string;
  label: string;
  onPress: () => void;
  selected?: boolean;
  disabled?: boolean;
};

export type MenuProps = {
  groups: MenuItem[][];
};

const isWeb = Platform.OS === 'web';

export function Menu({ groups }: MenuProps) {
  const visibleGroups = groups.filter((group) => group.length > 0);
  if (visibleGroups.length === 0) return null;

  return (
    <View style={styles.shadow}>
      <View style={styles.surface}>
        {visibleGroups.flatMap((group, groupIndex) =>
          group.map(({ id, label, onPress, selected, disabled = false }, itemIndex) => (
            <Fragment key={id}>
              {itemIndex > 0 ? (
                <View style={styles.divider} />
              ) : (
                groupIndex > 0 && <View style={styles.separator} />
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected, disabled }}
                disabled={disabled}
                onPress={onPress}
                style={(state) => [
                  styles.item,
                  !disabled && state.pressed && styles.pressed,
                  isWeb && 'focused' in state && state.focused === true && styles.focused,
                ]}>
                <ThemedText
                  style={Typography.caption}
                  themeColor={disabled ? 'buttonDisabled' : selected ? 'primary' : 'text'}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {label}
                </ThemedText>
              </Pressable>
            </Fragment>
          )),
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: { width: '100%', borderRadius: BorderRadius.lg, ...Shadows.surface },
  surface: {
    backgroundColor: LightColors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  item: { paddingVertical: LayoutSpacing.xs, paddingHorizontal: LayoutSpacing.lg },
  pressed: { backgroundColor: LightColors.backgroundElement },
  focused: {
    outlineColor: LightColors.primary,
    outlineStyle: 'solid',
    outlineWidth: 2,
    outlineOffset: -2,
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: LightColors.divider },
  separator: { height: LayoutSpacing.sm, backgroundColor: LightColors.backgroundSelected },
});
