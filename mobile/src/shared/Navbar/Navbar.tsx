import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RootState } from '../../stores/store';
import { logout } from '../../stores/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


const Navbar = () =>{
    const [showConfirm, setShowConfirm] = useState(false);  
    const dispatch = useDispatch();
    const navigate = useNavigation();
    const route = useRoute();
    const {user} = useSelector((state: RootState) => state.auth);
     const insets = useSafeAreaInsets();
    if(route.name === "Login" || route.name === "Register"){
        return null;
    }

    const handleLogout = async () => {
        setShowConfirm(false);
        dispatch(logout());
        AsyncStorage.removeItem("token");
        navigation.navigate("Login");
    };

    return(
       <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        {/* Лого */}
        <Text style={styles.logoText}>
          Auto<Text style={styles.logoAccent}>vibe</Text>
        </Text>

        <View style={styles.rightSection}>
          <Text style={styles.navLink}>Cars</Text>
          <Text style={styles.navLink}>Login</Text>
          <TouchableOpacity style={styles.registerBtn}>
            <Text style={styles.registerBtnText}>Register</Text>
          </TouchableOpacity>
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
  registerBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  registerBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});

export default Navbar;