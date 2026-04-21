import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RootState } from '../../stores/store';
import { logout } from '../../stores/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


const Navbar = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const insets = useSafeAreaInsets();
    if (route.name === "Login" || route.name === "Register") {
        return null;
    }

    const handleLogout = async () => {
        dispatch(logout());
        await AsyncStorage.removeItem("token");
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });
    };

    return (
        <View style={[styles.header, { paddingTop: insets.top }]}>
            <View style={styles.container}>
                <Pressable onPress={() => navigation.navigate("Home")}>
                    <Text style={styles.logoText}>
                        Auto<Text style={styles.logoAccent}>vibe</Text>
                    </Text>
                </Pressable>

                <View style={styles.rightSection}>
                    {isAuthenticated ? (
                        <>
                            <Text style={styles.userText} numberOfLines={1}>
                                {user?.email ?? "Logged in"}
                            </Text>
                            <Pressable onPress={handleLogout} style={styles.logoutBtn}>
                                <Text style={styles.logoutBtnText}>Logout</Text>
                            </Pressable>
                        </>
                    ) : (
                        <>
                            <Pressable onPress={() => navigation.navigate("Login")}>
                                <Text style={styles.navLink}>Login</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => navigation.navigate("Register")}
                                style={styles.registerBtn}
                            >
                                <Text style={styles.registerBtnText}>Register</Text>
                            </Pressable>
                        </>
                    )}

                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    header: {
        width: '100%',
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
    },
    container: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    logoText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
    logoAccent: { color: '#3b82f6' },
    rightSection: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    navLink: { color: 'white', fontSize: 14, fontWeight: '500' },
    userText: {
        color: '#cbd5e1',
        fontSize: 12,
        maxWidth: 160,
    },
    registerBtn: {
        backgroundColor: '#2563eb',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    registerBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    logoutBtn: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.55)',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    logoutBtnText: { color: '#f87171', fontWeight: 'bold', fontSize: 14 },
});

export default Navbar;