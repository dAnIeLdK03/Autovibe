import { createNavigationContainerRef } from '@react-navigation/native';

export const navigateRef = createNavigationContainerRef<any>();

export function navigate(name: string, params?: any) {
  if (navigateRef.isReady()) {
    navigateRef.navigate(name, params);
  }
}