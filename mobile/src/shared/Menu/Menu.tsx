import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  Pressable 
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from "../../stores/authSlice";
import type { RootState } from "../../stores/store";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

const Menu: React.FC = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
    const [showConfirm, setShowConfirm] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const toggleMenu = () => setIsOpen((prev) => !prev);

    const handleLogout = async () => {
        dispatch(logout());
        await AsyncStorage.removeItem("token");
        setShowConfirm(false);
        setIsOpen(false);
        navigation.navigate("Login");
    };

    const menuItems = [
        { label: "Home", onClick: () => navigation.navigate("CarList") },
        { label: "Profile", onClick: () => navigation.navigate("Profile") },
        { label: "Create New Ad", onClick: () => isAuthenticated ? navigation.navigate("CarCreate") : navigation.navigate("Login") },
        { label: "My Cars", onClick: () => navigation.navigate("MyCars") },
        { label: "My Favorites", onClick: () => navigation.navigate("MyFavorite") },
        { label: "Logout", onClick: () => setShowConfirm(true) },
    ];

    return (
        <View>
            <TouchableOpacity
                onPress={toggleMenu}
                style={[styles.menuButton, isOpen && styles.menuButtonActive]}
            >
                <Text style={{ color: isOpen ? '#70FFE2' : '#94a3b8', fontSize: 24 }}>☰</Text>
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable 
                    style={styles.modalOverlay} 
                    onPress={() => setIsOpen(false)} 
                />

                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={() => {
                                setIsOpen(false);
                                item.onClick();
                            }}
                        >
                            <Text style={styles.menuItemText}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>

            <ConfirmDialog
                isOpen={showConfirm}
                title="Logout"
                message="Are you sure you want to leave?"
                onConfirmClick={handleLogout}
                onClose={() => setShowConfirm(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuButtonActive: {
        backgroundColor: '#334155',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    menuContainer: {
        position: 'absolute',
        top: 60,
        right: 16,
        width: 200,
        backgroundColor: '#1e293b',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#334155',
        paddingVertical: 4,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    menuItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(51, 65, 85, 0.5)',
    },
    menuItemText: {
        color: '#cbd5e1',
        fontSize: 14,
        fontWeight: '600',
    }
});

export default Menu;