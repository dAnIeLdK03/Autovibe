import { sortOptions } from '../../../../api/carOptions';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Check } from 'lucide-react-native';

interface SortedCarsProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SortedCars({ value, onChange }: SortedCarsProps) {
  return (
    <View style={styles.container}>
      {sortOptions.map((option) => {
        const isActive = value === option.id;
        return (
          <TouchableOpacity
            key={option.id}
            activeOpacity={0.7}
            onPress={() => onChange(option.id)}
            style={[styles.button, isActive ? styles.activeButton : styles.inactiveButton]}
          >
            <Text style={[styles.label, isActive ? styles.activeText : styles.inactiveText]}>
              {option.label}
            </Text>
            {isActive && <Check size={20} color="#3b82f6" strokeWidth={3} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 8 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  activeButton: { backgroundColor: 'rgba(37, 99, 235, 0.2)', borderColor: '#3b82f6' },
  inactiveButton: { backgroundColor: 'rgba(30, 41, 59, 0.4)', borderColor: '#334155' },
  label: { fontSize: 16, fontWeight: 'bold' },
  activeText: { color: '#ffffff' },
  inactiveText: { color: '#94a3b8' },
});