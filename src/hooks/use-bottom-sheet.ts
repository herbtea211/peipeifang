import { createContext, useContext, type ReactNode } from 'react';

export const OpenBottomSheetContext = createContext<((content: ReactNode) => void) | null>(null);

export function useOpenBottomSheet() {
  const open = useContext(OpenBottomSheetContext);
  if (!open) {
    throw new Error('useOpenBottomSheet must be used within MainTabsLayout.');
  }
  return open;
}
