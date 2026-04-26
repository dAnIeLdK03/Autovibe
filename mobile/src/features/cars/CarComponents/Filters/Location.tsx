import { Platform, StyleSheet, TextInput, View } from "react-native";
import type { FilterSelectProps } from "./common";
import { useState } from "react";

export const Location = ({ value, onChange, placeholder = "Location" }: FilterSelectProps) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
    <View style={styles.outerContainer}>
      <View 
        style={[
          styles.innerContainer, 
          isFocused && styles.inputFocused
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#64748b"
          value={value || ""}
          onChangeText={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor="#3b82f6"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: 256,
    marginBottom: 12,
    marginLeft: 8,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        paddingVertical: 10,
      },
      android: {
        paddingVertical: 2,
      }
    }),
  },
  inputFocused: {
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    width: '100%',
    paddingHorizontal: 12,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});
