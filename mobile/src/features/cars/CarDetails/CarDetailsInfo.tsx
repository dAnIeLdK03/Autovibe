import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "../../../stores/store";
import type { CarDetails } from "../../../api/carsService";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/types";
import ConfirmDialog from "../../../shared/ConfirmDialog/ConfirmDialog";  

interface CarDeatilsInfoProps {
    car: CarDetails;
    isOwner: boolean;
    handleDelete: () => void;
}

function CarDetailsInfo({ car, isOwner, handleDelete }: CarDeatilsInfoProps) {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
        <View style={styles.gridItem}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );

    return (
        <View style={styles.card}>
            {/* Main Information */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Main information</Text>
                <View style={styles.grid}>
                    <InfoRow label="Body type" value={car.bodyType} />
                    <InfoRow label="Price" value={`${car.price.toLocaleString('bg-BG')} €`} />
                    <InfoRow label="Mileage" value={`${car.mileage} км`} />
                    <InfoRow label="Power" value={car.power} />
                    <InfoRow label="Fuel" value={car.fuelType} />
                    <InfoRow label="Transmission" value={car.transmission} />
                    <InfoRow label="Color" value={car.color} />
                    <InfoRow label="Location" value={car.location} />
                </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{car.description}</Text>
            </View>

            {/* Seller Information */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Seller Information</Text>
                {!isAuthenticated ? (
                    <Text style={styles.subText}>Login to see the seller's information.</Text>
                ) : (
                    <View style={styles.sellerBox}>
                        <View style={styles.sellerRow}>
                            <Text style={styles.label}>Seller</Text>
                            <Text style={styles.value}>{car.sellerFirstName} {car.sellerLastName}</Text>
                        </View>
                        <View style={styles.sellerRow}>
                            <Text style={styles.label}>Phone</Text>
                            <Text style={styles.value}>{car.sellerPhoneNumber}</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Actions */}
            {isOwner && (
                <View style={styles.buttonGroup}>
                    <TouchableOpacity 
                        style={[styles.button, styles.editButton]}
                        //za podobrqvane
                        onPress={() => navigation.navigate('CarDetails', { id: car.id })}
                    >
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.button, styles.deleteButton]}
                        onPress={() => setShowDeleteConfirm(true)}
                    >
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ConfirmDialog 
                isOpen={showDeleteConfirm}
                title="Delete Car"
                message="Are you sure you want to delete this car?"
                onConfirmClick={handleDelete}
                onClose={() => setShowDeleteConfirm(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.75)', 
        borderRadius: 20,
        padding: 22,
        marginTop: 8,
    },
    section: {
        marginBottom: 22,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f8fafc',
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
        paddingBottom: 8,
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 14,
        columnGap: 12,
    },
    gridItem: {
        width: '48%',
    },
    label: {
        fontWeight: '700',
        color: '#94a3b8',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    value: {
        color: '#f1f5f9',
        fontSize: 15,
        marginTop: 4,
    },
    description: {
        color: '#cbd5e1',
        lineHeight: 22,
        fontSize: 15,
    },
    subText: {
        color: '#64748b',
        fontSize: 13,
        lineHeight: 18,
    },
    sellerBox: {
        gap: 14,
    },
    sellerRow: {
        gap: 4,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#334155',
    },
    deleteButton: {
        backgroundColor: '#dc2626',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default CarDetailsInfo;