import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from '@autovibe/app-state';
import { useNavigation } from "@react-navigation/native";
import { useError } from "../../shared/hooks/useError";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { logout, updateUserData } from '@autovibe/app-state';
import { deleteUser } from "../../api/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SkeletonLoader } from "../../shared/UX/SkeletonLoading";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ConfirmDialog from "../../shared/ConfirmDialog/ConfirmDialog";
import ChangePassword from "./userComponents/ChangePassword";
import EditUserModal from "./userComponents/EditUserModal";

function Profile() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPassChangeOpen, setIsPassChangeOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const { handleError } = useError();

    const handleEdit = () => setIsEditOpen(true);
    const handlePassChange = () => setIsPassChangeOpen(true);

    const handleSave = (data: { firstName?: string; lastName?: string; phoneNumber?: string }) => {
        dispatch(updateUserData(data));
        setIsEditOpen(false);
    };

    const handleDelete = async () => {
        if (!user) {  
          setError("You are not logged in.");
          return;
        }
        setLoading(true);
        setError(null);
        try {
          await deleteUser(user.id);
          dispatch(logout());
          await AsyncStorage.removeItem("token");
          navigation.navigate("CarList");
        } catch (error) {
          handleError(error);
        } finally {
          setLoading(false);
          setShowDeleteConfirm(false);
        }
      };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <SkeletonLoader type="details" count={3} />
            </View>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.errorContainer}>
                    <Text style={styles.title}>Error loading profile</Text>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                    <Text style={styles.welcomeText}>
                        Welcome, {user?.firstName} {user?.lastName}
                    </Text>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Information:</Text>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoLabel}>Email: <Text style={styles.infoValue}>{user?.email}</Text></Text>
                        <Text style={styles.infoLabel}>First Name: <Text style={styles.infoValue}>{user?.firstName}</Text></Text>
                        <Text style={styles.infoLabel}>Last Name: <Text style={styles.infoValue}>{user?.lastName}</Text></Text>
                        <Text style={styles.infoLabel}>Phone Number: <Text style={styles.infoValue}>{user?.phoneNumber}</Text></Text>
                    </View>
                </View>

                <View style={styles.actionsSection}>
                    <Text style={styles.sectionTitle}>Actions:</Text>
                    
                    <View style={styles.buttonGrid}>
                        <TouchableOpacity 
                            style={[styles.button, styles.bgSlate]} 
                            onPress={handleEdit}
                        >
                            <Text style={styles.buttonText}>Edit Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.button, styles.bgGreen]} 
                            onPress={handlePassChange}
                        >
                            <Text style={styles.buttonText}>Change Password</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.button, styles.bgRed]} 
                            onPress={() => setShowDeleteConfirm(true)}
                        >
                            <Text style={styles.buttonText}>Delete Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <ConfirmDialog 
                isOpen={showDeleteConfirm}
                title="Delete Account"
                message="Are you sure you want to delete your account?"
                onConfirmClick={handleDelete}
                onClose={() => setShowDeleteConfirm(false)}
            />

            {isPassChangeOpen && (
                <ChangePassword 
                    isOpen={isPassChangeOpen}
                    onClose={() => setIsPassChangeOpen(false)}
                />
            )}

            {isEditOpen && (
                <EditUserModal 
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)} 
                    user={user} 
                    onSave={handleSave} 
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    scrollContent: {
        padding: 24,
        paddingTop: 40,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: 'white',
        letterSpacing: -0.5,
    },
    welcomeText: {
        fontSize: 20,
        color: '#94a3b8',
        marginTop: 8,
    },
    infoSection: {
        marginBottom: 40,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    centerContainer: {
        flex: 1,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoBox: {
        width: '100%',
        alignItems: 'center',
    },
    infoLabel: {
        color: '#94a3b8',
        fontSize: 18,
        marginVertical: 4,
    },
    infoValue: {
        color: 'white',
        fontWeight: '500',
    },
    actionsSection: {
        marginTop: 20,
    },
    buttonGrid: {
        gap: 12,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    bgSlate: { backgroundColor: '#334155' },
    bgRed: { backgroundColor: '#dc2626' },
    bgGreen: { backgroundColor: '#166534' },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 10,
    }
});

export default Profile;