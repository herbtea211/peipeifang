import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Collapsible } from '@/components/ui/collapsible';
import { ListGroup, type ListGroupItem } from '@/components/ui/list-group';
import { Menu } from '@/components/ui/menu';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, LightColors, MaxContentWidth, Spacing } from '@/constants/theme';
import { showAlert } from '@/utils/alert';

const demoItems: ListGroupItem[] = [
  { id: 'soup', label: '牛肉湯', labelDetail: '冷藏保存', detail: '12 份', leftIcon: 'plus', rightIcon: 'chevron-right' },
  { id: 'sauce', label: '濃蝦醬', detail: '這是一段測試右側最大寬度與省略號的長文字' },
  { id: 'pizza', label: '拿坡里披薩' },
];

const alertCancel = { text: '取消', style: 'cancel', onPress: () => console.info('Alert 回呼：取消') } as const;
const alertDelete = { text: '刪除', style: 'destructive', onPress: () => console.info('Alert 回呼：刪除') } as const;

export default function TabTwoScreen() {
  const [items, setItems] = useState(demoItems);
  const [selected, setSelected] = useState<string>();
  const [showSample, setShowSample] = useState(true);
  const [menuAction, setMenuAction] = useState('');
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: LightColors.surface }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Explore</ThemedText>
          <ThemedText style={styles.centerText} themeColor="mutedText">
            This starter app includes example{'\n'}code to help you get started.
          </ThemedText>

          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView type="backgroundElement" style={styles.linkButton}>
                <ThemedText type="link">Expo documentation</ThemedText>
                <SymbolView
                  tintColor={LightColors.baseText}
                  name={{ ios: 'arrow.up.right.square', android: 'link', web: 'link' }}
                  size={12}
                />
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </ThemedView>

        <ThemedView style={styles.sectionsWrapper}>
          <Collapsible title="File-based routing">
            <ThemedText type="small">
              This app has two screens: <ThemedText type="code">src/app/index.tsx</ThemedText> and{' '}
              <ThemedText type="code">src/app/explore.tsx</ThemedText>
            </ThemedText>
            <ThemedText type="small">
              The layout file in <ThemedText type="code">src/app/_layout.tsx</ThemedText> sets up
              the tab navigator.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/router/introduction">
              <ThemedText type="linkPrimary">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Android, iOS, and web support">
            <ThemedView type="backgroundElement" style={styles.collapsibleContent}>
              <ThemedText type="small">
                You can open this project on Android, iOS, and the web. To open the web version,
                press <ThemedText type="smallBold">w</ThemedText> in the terminal running this
                project.
              </ThemedText>
              <Image
                source={require('@/assets/images/tutorial-web.png')}
                style={styles.imageTutorial}
              />
            </ThemedView>
          </Collapsible>

          <Collapsible title="Images">
            <ThemedText type="small">
              For static images, you can use the <ThemedText type="code">@2x</ThemedText> and{' '}
              <ThemedText type="code">@3x</ThemedText> suffixes to provide files for different
              screen densities.
            </ThemedText>
            <Image source={require('@/assets/images/react-logo.png')} style={styles.imageReact} />
            <ExternalLink href="https://reactnative.dev/docs/images">
              <ThemedText type="linkPrimary">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Color theme">
            <ThemedText type="small">
              This app uses a light color theme on every platform.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
              <ThemedText type="linkPrimary">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Animations">
            <ThemedText type="small">
              This template includes an example of an animated component. The{' '}
              <ThemedText type="code">src/components/ui/collapsible.tsx</ThemedText> component uses
              the powerful <ThemedText type="code">react-native-reanimated</ThemedText> library to
              animate opening this hint.
            </ThemedText>
          </Collapsible>
          <ThemedText accessibilityRole="header" style={styles.centerText}>List 測試範例</ThemedText>
          <ListGroup
            title="配方分類"
            items={items.map((item) => ({
              ...item,
              onPress: item.id === 'soup' ? () => setSelected(item.label) : undefined,
              onDelete: item.id !== 'pizza'
                ? () => setItems((current) => current.filter(({ id }) => id !== item.id))
                : undefined,
            }))}
          />
          <ListGroup
            items={showSample ? [{
              id: 'sample',
              label: '另一組的單筆資料',
              onDelete: () => setShowSample(false),
            }] : []}
          />
          {selected && <ThemedText>已選取：{selected}</ThemedText>}

          <ThemedText accessibilityRole="header" style={styles.centerText}>Menu 測試範例</ThemedText>
          <View style={styles.narrowMenu}>
            <Menu groups={[[{ id: 'single', label: '單一操作', onPress: () => setMenuAction('單一操作') }]]} />
          </View>
          <Menu groups={[[
            { id: 'group-first', label: '單組第一項', onPress: () => setMenuAction('單組第一項') },
            { id: 'group-last', label: '單組第二項', onPress: () => setMenuAction('單組第二項') },
          ]]} />
          <Menu groups={[
            [],
            [
              { id: 'default', label: '預設操作', onPress: () => setMenuAction('預設操作') },
              { id: 'selected', label: '已選取', selected: true, onPress: () => setMenuAction('已選取') },
              { id: 'disabled', label: '停用項目', disabled: true, onPress: () => setMenuAction('停用項目') },
            ],
            [],
            [
              { id: 'both', label: '已選取且停用', selected: true, disabled: true, onPress: () => setMenuAction('已選取且停用') },
              { id: 'long', label: '這是一個很長的選單項目，用來確認長文字在父層寬度不足時會單行顯示尾端省略號。'.repeat(3), onPress: () => setMenuAction('長文字') },
            ],
            [],
          ]} />
          <View>
            <ThemedText>空群組不顯示選單</ThemedText>
            <Menu groups={[[], []]} />
          </View>
          {!!menuAction && <ThemedText>Menu 回呼：{menuAction}</ThemedText>}

          <ThemedText accessibilityRole="header" style={styles.centerText}>Alert 測試範例</ThemedText>
          <Button label="預設 Alert" showLeftIcon={false} onPress={() => showAlert('通知', '這是預設 Alert。')} />
          <Button
            label="單一按鈕 Alert"
            showLeftIcon={false}
            onPress={() => showAlert('通知', '關閉後執行回呼。', [
              { text: '知道了', onPress: () => console.info('Alert 回呼：知道了') },
            ])}
          />
          <Button
            label="確認刪除 Alert"
            showLeftIcon={false}
            onPress={() => showAlert('刪除項目？', '此操作無法復原。', [alertCancel, alertDelete])}
          />
          <Button
            label="交換按鈕順序"
            showLeftIcon={false}
            onPress={() => showAlert('刪除項目？', '此操作無法復原。', [alertDelete, alertCancel])}
          />
          <Button
            label="三個按鈕 Alert"
            showLeftIcon={false}
            onPress={() => showAlert('三個操作', undefined, [
              { text: '捨棄', onPress: () => console.info('Alert 回呼：捨棄') },
              alertCancel,
              alertDelete,
            ])}
          />
          <Button
            label="未指定取消按鈕"
            showLeftIcon={false}
            onPress={() => showAlert('無法識別取消操作', undefined, [
              { text: '捨棄', onPress: () => console.info('Alert 回呼：捨棄') },
              alertDelete,
            ])}
          />
          <Button
            label="Native Alert Options"
            showLeftIcon={false}
            onPress={() => showAlert('原生 Options', 'Android 可點外部關閉。', [
              { text: '知道了', onPress: () => console.info('Alert 回呼：知道了') },
            ], {
              cancelable: true,
              userInterfaceStyle: 'dark',
              onDismiss: () => console.info('Alert 回呼：dismiss'),
            })}
          />
        </ThemedView>
        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    justifyContent: 'center',
    gap: Spacing.one,
    alignItems: 'center',
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  narrowMenu: { width: '65%' },
  collapsibleContent: {
    alignItems: 'center',
  },
  imageTutorial: {
    width: '100%',
    aspectRatio: 296 / 171,
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
  },
  imageReact: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
});
