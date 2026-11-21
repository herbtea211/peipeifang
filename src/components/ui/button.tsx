import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Platform, Pressable, StyleSheet, Text, type TextStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolateColor,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { getIconSymbol, Icon } from '@/components/ui/icon';
import { LightColors, Typography } from '@/constants/theme';

export type ButtonLevel = 'primary' | 'secondary';

export interface ButtonProps {
  level?: ButtonLevel;
  label?: string;
  leftIcon?: string;
  rightIcon?: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  haptic?: boolean;
  borderRadius?: number;
  fontFamily?: string;
  fontWeight?: TextStyle['fontWeight'];
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  accessibilityLabel?: string;
}

const metrics = {
  primary: { label: '新增', height: 56, paddingHorizontal: 32, iconSize: 24, gap: 8 },
  secondary: { label: '人份', height: 48, paddingHorizontal: 16, iconSize: 16, gap: 4 },
} as const;

const transition = { duration: 150, easing: Easing.bezier(0.42, 0, 0.58, 1) };
const primaryPressed = '#007AFF99';
const throttleMs = 500;
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

export function Button({
  level = 'primary',
  label,
  leftIcon = 'plus',
  rightIcon = 'plus',
  showLeftIcon = level === 'primary',
  showRightIcon = level === 'secondary',
  disabled = false,
  loading = false,
  onPress,
  haptic = true,
  borderRadius = 999,
  fontFamily = Typography.button.fontFamily,
  fontWeight = Typography.button.fontWeight,
  fontSize = Typography.button.fontSize,
  lineHeight = Typography.button.lineHeight,
  letterSpacing = (fontSize * -0.41) / 100,
  accessibilityLabel,
}: ButtonProps) {
  const size = metrics[level];
  const text = (label ?? size.label).replace(/\r\n|[\r\n\u2028\u2029]/g, ' ');
  const hasLabel = text.trim().length > 0;
  const leftSymbol = showLeftIcon && leftIcon ? getIconSymbol(leftIcon) : undefined;
  const rightSymbol = showRightIcon && rightIcon ? getIconSymbol(rightIcon) : undefined;
  const isPrimary = level === 'primary';
  const blocked = disabled || loading;
  const lastPressAt = useRef(-Infinity);
  const pressStarted = useRef<boolean | null>(null);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!__DEV__) return;
    if (showLeftIcon && leftIcon && !leftSymbol) {
      console.error(`Button: unknown left icon "${leftIcon}".`);
    }
    if (showRightIcon && rightIcon && !rightSymbol) {
      console.error(`Button: unknown right icon "${rightIcon}".`);
    }
  }, [leftIcon, leftSymbol, rightIcon, rightSymbol, showLeftIcon, showRightIcon]);

  useEffect(() => {
    if (blocked) {
      pressStarted.current = false;
      progress.set(0);
    }
  }, [blocked, progress]);

  const surfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: blocked
      ? LightColors.buttonDisabled
      : isPrimary
        ? interpolateColor(progress.get(), [0, 1], [LightColors.primary, primaryPressed])
        : LightColors.surface,
  }));

  const foregroundStyle = useAnimatedStyle(() => ({
    opacity: isPrimary || blocked ? 1 : 1 - progress.get() * 0.4,
  }));

  function handlePressIn() {
    if (blocked) return;
    progress.set(withTiming(1, transition));
    const accepted = !!onPress && performance.now() - lastPressAt.current >= throttleMs;
    pressStarted.current = accepted;
    if (accepted && haptic && isNative) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  }

  function handlePressOut() {
    progress.set(withTiming(0, transition));
  }

  function handlePress() {
    const accepted = pressStarted.current;
    pressStarted.current = null;
    const now = performance.now();
    if (blocked || !onPress || accepted === false || now - lastPressAt.current < throttleMs) return;
    lastPressAt.current = now;
    onPress();
  }

  if (!hasLabel && ((!leftSymbol && !rightSymbol) || !accessibilityLabel?.trim())) return null;

  const foreground = isPrimary || blocked ? LightColors.surface : LightColors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel?.trim() || text}
      aria-disabled={blocked}
      aria-busy={loading}
      disabled={blocked}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.button,
        { height: size.height, paddingHorizontal: size.paddingHorizontal, borderRadius },
      ]}>
      <Animated.View pointerEvents="none" style={[styles.fill, surfaceStyle, { borderRadius }]} />
      {!isPrimary && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.fill,
            styles.outline,
            foregroundStyle,
            { borderColor: foreground, borderRadius },
          ]}
        />
      )}
      <Animated.View
        pointerEvents="none"
        style={[styles.content, foregroundStyle, { gap: size.gap }]}>
        {loading ? (
          <Spinner size={size.iconSize} />
        ) : (
          leftSymbol && <Icon symbol={leftSymbol} size={size.iconSize} color={foreground} />
        )}
        {hasLabel && (
          <Text
            numberOfLines={1}
            ellipsizeMode="clip"
            style={[
              styles.label,
              { color: foreground, fontFamily, fontWeight, fontSize, lineHeight, letterSpacing },
            ]}>
            {text}
          </Text>
        )}
        {!loading && rightSymbol && (
          <Icon symbol={rightSymbol} size={size.iconSize} color={foreground} />
        )}
      </Animated.View>
    </Pressable>
  );
}

function Spinner({ size }: { size: number }) {
  const turns = useSharedValue(0);

  useEffect(() => {
    turns.set(
      withRepeat(
        withTiming(1, { duration: 1000, easing: Easing.linear, reduceMotion: ReduceMotion.Never }),
        -1,
        false,
        undefined,
        ReduceMotion.Never,
      ),
    );
    return () => cancelAnimation(turns);
  }, [turns]);

  const rotation = useAnimatedStyle(() => ({ transform: [{ rotate: `${turns.get() * 360}deg` }] }));

  return (
    <Animated.View
      style={[styles.spinner, rotation, { width: size, height: size, borderRadius: size / 2 }]}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: StyleSheet.absoluteFill,
  outline: { borderWidth: 1 },
  content: { flexDirection: 'row', flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  label: { textAlign: 'center', flexShrink: 0, includeFontPadding: false },
  spinner: { borderWidth: 2, borderColor: LightColors.primary, borderRightColor: 'transparent' },
});
