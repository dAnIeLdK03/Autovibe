import { ActivityIndicator, View } from 'react-native';

export const LoadingSpinner = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#70FFE2" />
  </View>
);