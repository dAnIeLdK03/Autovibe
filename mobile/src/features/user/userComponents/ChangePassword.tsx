import React, { useState } from "react";
import { 
    ActivityIndicator, 
    KeyboardAvoidingView, 
    Modal, 
    Platform, 
    ScrollView, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    StyleSheet 
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { EditPasswordModalProps, UpdatePassword } from "../../../api/userService";
import { extractApiErrorMessage } from "../../../shared/extractErrorMessage/extractApiErrorMessage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/types";

interface ChangePasswordFields {
    CurrentPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
}

const ChangePassword: React.FC<EditPasswordModalProps> = ({ isOpen, onClose, onSave }) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { control, handleSubmit, watch, formState: { errors } } = useForm<ChangePasswordFields>({
        defaultValues: {
            CurrentPassword: '',
            NewPassword: '',
            ConfirmPassword: ''
        }
    });

    const newPassword = watch("NewPassword");

    if (!isOpen) return null;

    const onSubmit = async (formData: ChangePasswordFields) => {
        try {
            setLoading(true);
            setError(null);
            await UpdatePassword(formData);
            
            if (onSave) {
                onSave();
            }

            Toast.show({ 
                type: "success", 
                text1: "Password changed successfully" 
            });

            setTimeout(() => {
                onClose();
            }, 2000);

            navigation.navigate("Login");

        } catch (err: unknown) {
            const apiMessage = extractApiErrorMessage(err);
            setError(apiMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal transparent visible={isOpen} animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.card}>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Change Password</Text>
                            <TouchableOpacity onPress={onClose} hitSlop={10}>
                                <Text style={styles.closeX}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {error && (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        <Text style={styles.label}>Current Password</Text>
                        <Controller
                            control={control}
                            name="CurrentPassword"
                            rules={{ required: "Current Password is required" }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.CurrentPassword && styles.inputError]}
                                    secureTextEntry
                                    placeholderTextColor="#475569"
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                        {errors.CurrentPassword && <Text style={styles.errorHint}>{errors.CurrentPassword.message}</Text>}

                        <Text style={[styles.label, { marginTop: 12 }]}>New Password</Text>
                        <Controller
                            control={control}
                            name="NewPassword"
                            rules={{
                                required: "New password is required",
                                minLength: { value: 6, message: "Minimum 6 characters" }
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.NewPassword && styles.inputError]}
                                    secureTextEntry
                                    placeholderTextColor="#475569"
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                        {errors.NewPassword && <Text style={styles.errorHint}>{errors.NewPassword.message}</Text>}

                        <Text style={[styles.label, { marginTop: 12 }]}>Confirm Password</Text>
                        <Controller
                            control={control}
                            name="ConfirmPassword"
                            rules={{
                                required: "Confirm password is required",
                                validate: (val) => val === newPassword || "Passwords do not match"
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.ConfirmPassword && styles.inputError]}
                                    secureTextEntry
                                    placeholderTextColor="#475569"
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                        {errors.ConfirmPassword && <Text style={styles.errorHint}>{errors.ConfirmPassword.message}</Text>}

                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={onClose} style={[styles.btn, styles.btnCancel]}>
                                <Text style={styles.btnTextCancel}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleSubmit(onSubmit)}
                                style={[styles.btn, styles.btnSave]}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnTextSave}>Save</Text>}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        justifyContent: 'center', 
        padding: 20 
    },
    card: { 
        backgroundColor: '#1e293b', 
        borderRadius: 24, 
        padding: 24, 
        borderWidth: 1, 
        borderColor: '#334155' 
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 20 
    },
    title: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: 'white' 
    },
    closeX: { 
        color: '#94a3b8', 
        fontSize: 22 
    },
    label: { 
        fontSize: 13, 
        color: '#94a3b8', 
        marginBottom: 6, 
        textTransform: 'uppercase' 
    },
    input: { 
        backgroundColor: '#0f172a', 
        borderWidth: 1, 
        borderColor: '#334155', 
        borderRadius: 12, 
        padding: 12, 
        color: 'white' 
    },
    inputError: { 
        borderColor: '#ef4444' 
    },
    errorHint: { 
        color: '#ef4444', 
        fontSize: 11, 
        marginTop: 4 
    },
    errorBox: { 
        backgroundColor: 'rgba(239, 68, 68, 0.1)', 
        padding: 10, 
        borderRadius: 10, 
        marginBottom: 15, 
        borderLeftWidth: 4, 
        borderLeftColor: '#ef4444' 
    },
    errorText: { 
        color: '#ef4444', 
        fontSize: 13 
    },
    buttonRow: { 
        flexDirection: 'row', 
        gap: 12, 
        marginTop: 30 
    },
    btn: { 
        flex: 1, 
        height: 50, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    btnCancel: { 
        borderWidth: 1, 
        borderColor: '#334155' 
    },
    btnSave: { 
        backgroundColor: '#3b82f6' 
    },
    btnTextCancel: { 
        color: '#94a3b8', 
        fontWeight: '600' 
    },
    btnTextSave: { 
        color: 'white', 
        fontWeight: 'bold' 
    }
});

export default ChangePassword;