import { SymbolView, type SymbolViewProps } from 'expo-symbols';

const symbols = new Map<string, SymbolViewProps['name']>([
  ['plus', { ios: 'plus', android: 'add', web: 'add' }],
  ['chevron-right', { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }],
]);

export function getIconSymbol(name: string) {
  return symbols.get(name);
}

type IconProps = {
  symbol: SymbolViewProps['name'];
  size: number;
  color: string;
};

export function Icon({ symbol, size, color }: IconProps) {
  return <SymbolView name={symbol} size={size} tintColor={color} />;
}
