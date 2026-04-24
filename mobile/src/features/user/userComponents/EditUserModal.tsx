import { useEffect, useState } from "react";
import { EditUserModalProps, getUser, updateUser, UserData } from "../../../api/userService";
import { Controller, useForm } from "react-hook-form";
import { extractApiErrorMessage } from "../../../shared/extractErrorMessage/extractApiErrorMessage";
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const methods = useForm<UserData>();
  const { handleSubmit, reset, control, formState: { errors } } = methods;


   useEffect(() => {
    const fetchUserEdit = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await getUser();
        reset({
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber
        });
      } catch (error) {
        const apiMessage = extractApiErrorMessage(error);
        setError(apiMessage);
      }finally{
        setLoading(false);
      }
    };

    if (isOpen) fetchUserEdit();
  }, [isOpen, user?.id, reset]);

  if (!isOpen || !user) return null;

  const onSubmit = async (formData: UserData) => {
    try {
      setError(null);
      await updateUser(user.id!, formData);

      if (onSave) {
        onSave(formData);
      }
      onClose();
    } catch (error) {
      const apiMessage = extractApiErrorMessage(error);
      setError(apiMessage);
    }
  };

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>Edit Profile</Text>
              <TouchableOpacity onPress={onClose} hitSlop={10}>
                <Text style={styles.closeX}>✕</Text>
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <Controller
                  control={control}
                  name="firstName"
                  rules={{ required: "First name is required" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.firstName && styles.inputError]}
                      placeholderTextColor="#475569"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.firstName && <Text style={styles.errorHint}>{errors.firstName.message}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <Controller
                  control={control}
                  name="lastName"
                  rules={{ required: "Last name is required" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.lastName && styles.inputError]}
                      placeholderTextColor="#475569"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.lastName && <Text style={styles.errorHint}>{errors.lastName.message}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <Controller
                  control={control}
                  name="phoneNumber"
                  rules={{ required: "Phone number is required" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, errors.phoneNumber && styles.inputError]}
                      keyboardType="phone-pad"
                      placeholderTextColor="#475569"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.phoneNumber && <Text style={styles.errorHint}>{errors.phoneNumber.message}</Text>}
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={onClose} style={styles.btnCancel}>
                  <Text style={styles.btnTextCancel}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  style={styles.btnSave}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.btnTextSave}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeX: {
    color: '#94a3b8',
    fontSize: 22,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: 'white',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorHint: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  btnSave: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextCancel: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  btnTextSave: {
    color: 'white',
    fontWeight: '600',
  },
});

export default EditUserModal;
