import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View, type AccessibilityActionEvent } from 'react-native';
import Swipeable, { type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

import { ThemedText } from '@/components/themed-text';
import { getIconSymbol, Icon } from '@/components/ui/icon';
import { LayoutSpacing, LightColors, Typography } from '@/constants/theme';

export type ListItemProps = {
  label: string;
  labelDetail?: string;
  detail?: string;
  leftIcon?: string;
  rightIcon?: string;
  onPress?: () => void;
  onDelete?: () => void;
};

const iconSize = LayoutSpacing.xl;
const horizontalPadding = LayoutSpacing.lg;
const iconGap = LayoutSpacing.sm;
const isWeb = Platform.OS === 'web';

export function listItemLabelInset(leftIcon?: string) {
  return horizontalPadding + (leftIcon && getIconSymbol(leftIcon) ? iconSize + iconGap : 0);
}

type SwipeCoordination = {
  onSwipeStart?: (close: () => void) => void;
  onSwipeEnd?: (close: () => void) => void;
};

export function ListItem({
  label,
  labelDetail,
  detail,
  leftIcon,
  rightIcon,
  onPress,
  onDelete,
  onSwipeStart,
  onSwipeEnd,
}: ListItemProps & SwipeCoordination) {
  const left = leftIcon ? getIconSymbol(leftIcon) : undefined;
  const right = rightIcon ? getIconSymbol(rightIcon) : undefined;
  const swipeable = useRef<SwipeableMethods>(null);
  const pressedWhileExpanded = useRef(false);
  const didDrag = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const canDelete = !!onDelete;
  const deleteLabel = `刪除 ${label}`;

  const close = useCallback(() => swipeable.current?.close(), []);

  useEffect(() => {
    if (!canDelete) {
      pressedWhileExpanded.current = false;
      didDrag.current = false;
    }
    return () => onSwipeEnd?.(close);
  }, [close, onSwipeEnd, canDelete]);

  if (!canDelete && expanded) {
    // Removing the swipe container does not emit onSwipeableClose.
    setExpanded(false);
  }

  function markDrag() {
    didDrag.current = true;
  }

  function deleteItem() {
    close();
    if (isWeb && expanded && onDelete) {
      // Web queues close() for the next frame. Let it start before the parent can unmount the row.
      queueMicrotask(() => requestAnimationFrame(onDelete));
    } else {
      onDelete?.();
    }
  }

  const content = (
    <>
      {left && <Icon symbol={left} size={iconSize} color={LightColors.primary} />}
      <View style={styles.main}>
        <ThemedText style={Typography.body} themeColor="text" numberOfLines={1} ellipsizeMode="tail">
          {label}
        </ThemedText>
        {!!labelDetail && (
          <ThemedText style={Typography.caption} themeColor="textSecondary" numberOfLines={1} ellipsizeMode="tail">
            {labelDetail}
          </ThemedText>
        )}
      </View>
      {(!!detail || right) && (
        <View style={styles.trailing}>
          {!!detail && (
            <ThemedText style={styles.detail} themeColor="textSecondary" numberOfLines={1} ellipsizeMode="tail">
              {detail}
            </ThemedText>
          )}
          {right && <Icon symbol={right} size={iconSize} color={LightColors.primary} />}
        </View>
      )}
    </>
  );

  const deleteAction = !isWeb && onDelete && !expanded
    ? {
        accessible: true,
        accessibilityActions: [{ name: 'delete', label: '刪除' }],
        onAccessibilityAction: (event: AccessibilityActionEvent) => {
          if (event.nativeEvent.actionName === 'delete') deleteItem();
        },
      }
    : {};

  const row = (
    <View style={styles.background}>
      {onPress || expanded ? (
        <Pressable
          {...deleteAction}
          accessibilityRole="button"
          accessibilityLabel={expanded ? `收合 ${label} 的刪除操作` : undefined}
          onPressIn={onDelete ? () => {
            didDrag.current = false;
            pressedWhileExpanded.current = expanded;
          } : undefined}
          onPress={() => {
            // Web can emit a click after a mouse drag. Swipeable already handled that gesture.
            if (didDrag.current) {
              didDrag.current = false;
              return;
            }
            // Swipeable can start closing on tap before Pressable handles the click.
            if (expanded || pressedWhileExpanded.current) {
              pressedWhileExpanded.current = false;
              close();
              return;
            }
            onPress?.();
          }}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
          {content}
        </Pressable>
      ) : (
        <View {...deleteAction} style={styles.row}>{content}</View>
      )}
    </View>
  );

  if (!onDelete) return row;

  const deleteText = <ThemedText style={Typography.button} themeColor="surface">刪除</ThemedText>;

  return (
    <View>
      <Swipeable
        ref={swipeable}
        onSwipeableOpenStartDrag={markDrag}
        onSwipeableCloseStartDrag={markDrag}
        overshootRight={false}
        onSwipeableWillOpen={() => {
          setExpanded(true);
          onSwipeStart?.(close);
        }}
        onSwipeableClose={() => {
          setExpanded(false);
          onSwipeEnd?.(close);
        }}
        renderRightActions={() => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={deleteLabel}
            accessibilityElementsHidden={isWeb || !expanded}
            importantForAccessibility={isWeb || !expanded ? 'no-hide-descendants' : 'auto'}
            aria-hidden={isWeb || !expanded}
            tabIndex={-1}
            onPress={deleteItem}
            style={styles.delete}>
            {deleteText}
          </Pressable>
        )}>
        {row}
      </Swipeable>
      {isWeb && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={deleteLabel}
          onPress={deleteItem}
          style={(state) => {
            const focused = 'focused' in state && state.focused === true;
            return [
              styles.delete,
              styles.keyboardDelete,
              { opacity: focused ? 1 : 0, pointerEvents: focused ? 'auto' : 'none' },
            ];
          }}>
          {deleteText}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: LightColors.surface },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalPadding,
    paddingVertical: LayoutSpacing.md,
    gap: iconGap,
  },
  main: { flex: 1, minWidth: 0, gap: LayoutSpacing.xs },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '45%',
    gap: LayoutSpacing.lg,
  },
  detail: { ...Typography.caption, textAlign: 'right', flexShrink: 1, minWidth: 0 },
  pressed: { opacity: 0.7 },
  delete: {
    backgroundColor: LightColors.error,
    paddingHorizontal: LayoutSpacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardDelete: { position: 'absolute', top: 0, bottom: 0, right: 0 },
});
