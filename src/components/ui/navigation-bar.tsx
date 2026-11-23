import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { getIconSymbol, Icon } from '@/components/ui/icon';
import { LayoutSpacing, LightColors, Typography } from '@/constants/theme';

export interface NavigationBarProps {
  title?: string;
  showTitle?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  leftIconDisabled?: boolean;
  rightIconDisabled?: boolean;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
  scrollY?: number;
}

const defaultHeight = 96;
const shortHeight = 44;
const iconSize = 24;
const heightTransition = { duration: 200, easing: Easing.bezier(0.42, 0, 0.58, 1) };

export function NavigationBar({
  title,
  showTitle = true,
  leftIcon,
  rightIcon,
  showLeftIcon = true,
  showRightIcon = true,
  leftIconDisabled = false,
  rightIconDisabled = false,
  onLeftIconPress,
  onRightIconPress,
  scrollY = 0,
}: NavigationBarProps) {
  const targetHeight = scrollY > 0 ? shortHeight : defaultHeight;
  const height = useSharedValue(targetHeight);

  useEffect(() => {
    height.set(withTiming(targetHeight, heightTransition));
  }, [height, targetHeight]);

  const heightStyle = useAnimatedStyle(() => ({ height: height.get() }));
  const leftSymbol = showLeftIcon && leftIcon ? getIconSymbol(leftIcon) : undefined;
  const rightSymbol = showRightIcon && rightIcon ? getIconSymbol(rightIcon) : undefined;

  return (
    <Animated.View style={[styles.bar, heightStyle]}>
      <View style={styles.iconSlot}>
        {leftSymbol && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={leftIcon}
            aria-disabled={leftIconDisabled}
            disabled={leftIconDisabled}
            onPress={onLeftIconPress}
            style={styles.iconSlot}>
            <Icon
              symbol={leftSymbol}
              size={iconSize}
              color={leftIconDisabled ? LightColors.buttonDisabled : LightColors.primary}
            />
          </Pressable>
        )}
      </View>
      <View style={styles.titleSlot}>
        {showTitle && title !== undefined && (
          <Text
            accessibilityRole="header"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.title}>
            {title}
          </Text>
        )}
      </View>
      <View style={styles.iconSlot}>
        {rightSymbol && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={rightIcon}
            aria-disabled={rightIconDisabled}
            disabled={rightIconDisabled}
            onPress={onRightIconPress}
            style={styles.iconSlot}>
            <Icon
              symbol={rightSymbol}
              size={iconSize}
              color={rightIconDisabled ? LightColors.buttonDisabled : LightColors.primary}
            />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: LayoutSpacing.lg,
    gap: LayoutSpacing.sm,
  },
  iconSlot: {
    width: iconSize,
    height: iconSize,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSlot: { flex: 1, minWidth: 0 },
  title: {
    ...Typography.title,
    color: LightColors.text,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
