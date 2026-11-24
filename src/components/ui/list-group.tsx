import { Fragment, useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ListItem, listItemLabelInset, type ListItemProps } from '@/components/ui/list-item';
import { BorderRadius, LayoutSpacing, LightColors, Shadows, Typography } from '@/constants/theme';

export type ListGroupItem = ListItemProps & { id: string };

type ListGroupProps = {
  title?: string;
  items: ListGroupItem[];
};

export function ListGroup({ title, items }: ListGroupProps) {
  const openRow = useRef<() => void>(null);

  const handleSwipeStart = useCallback((close: () => void) => {
    if (openRow.current !== close) openRow.current?.();
    openRow.current = close;
  }, []);

  const handleSwipeEnd = useCallback((close: () => void) => {
    if (openRow.current === close) openRow.current = null;
  }, []);

  if (items.length === 0) return null;

  return (
    <View style={styles.group}>
      {!!title && (
        <ThemedText
          accessibilityRole="header"
          themeColor="text"
          style={Typography.button}
          numberOfLines={1}
          ellipsizeMode="tail">
          {title}
        </ThemedText>
      )}
      <View style={styles.shadow}>
        <View style={styles.surface}>
          {items.map(({ id, ...item }, index) => (
            <Fragment key={id}>
              <ListItem {...item} onSwipeStart={handleSwipeStart} onSwipeEnd={handleSwipeEnd} />
              {index < items.length - 1 && (
                <View style={[styles.divider, { marginLeft: listItemLabelInset(item.leftIcon) }]} />
              )}
            </Fragment>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { width: '100%', gap: LayoutSpacing.sm },
  shadow: { ...Shadows.surface, borderRadius: BorderRadius.lg },
  surface: {
    backgroundColor: LightColors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: LightColors.divider },
});
