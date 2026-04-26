import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Option{
    label: string;
    value: string;
}

interface BaseSelectProps{
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: Option[];
    variant?: 'grid' | 'dropdown';
}

export const BaseSelect = ({ label, options, value, onChange, variant = 'grid'}: BaseSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(opt => opt.value === value)?.label || ` ${label}`;

    if(variant === 'grid'){
    return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.grid}>
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              activeOpacity={0.7}
              onPress={() => onChange(opt.value)}
              style={[
                styles.button,
                isActive ? styles.activeButton : styles.inactiveButton
              ]}
            >
              <Text style={[
                styles.buttonText,
                isActive ? styles.activeText : styles.inactiveText
              ]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

 return(
    <View style={[styles.container, isOpen && { zIndex: 1000 }]}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsOpen(!isOpen)}
        style={styles.trigger}
      >
        <Text style={styles.triggerText}>{selectedLabel}</Text>
        <Text style={[styles.arrow, isOpen && styles.arrowRotate]}>▼</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          <ScrollView bounces={false} style={styles.scrollView}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={styles.option}
                onPress={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <Text style={styles.optionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
  },
  triggerText: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
  },
  arrow: {
    color: '#94a3b8',
    fontSize: 10,
  },
  arrowRotate: {
    transform: [{ rotate: '180deg' }],
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    elevation: 10, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    maxHeight: 200,
    overflow: 'hidden',
  },
  scrollView: {
    width: '100%',
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  optionText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  container: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  inactiveButton: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeText: {
    color: '#ffffff',
  },
  inactiveText: {
    color: '#94a3b8',
  },
});