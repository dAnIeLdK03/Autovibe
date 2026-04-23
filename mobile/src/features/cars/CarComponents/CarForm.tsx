import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Image,
    ActivityIndicator
} from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { CarFormValues } from './CarValidations/CarCreateValidations';
import type { RootState } from '../../../stores/store';
import { getImageUrl } from '../../../utils/getImageurl';

interface CarFormProps {
    handleImageChange: () => void;
    imagePreview: string[];
    submitLabel?: string;
    title: string;
    onRemoveImage?: (index: number) => void;
    onFormSubmit: () => void;
}

function CarForm({ handleImageChange, imagePreview, onRemoveImage, onFormSubmit, submitLabel = "Create", title = "Create Ad" }: CarFormProps) {
    const { control, formState: { errors }, watch } = useFormContext<CarFormValues>();
    const { error, loading } = useSelector((state: RootState) => state.cars);
    const navigation = useNavigation();

    const descriptionValue = watch("description") || "";
    const MAX_CHARS = 5000;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.card}>

                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>Fill in the technical specifications below</Text>
                </View>

                {error && (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.formSection}>
                    <Text style={styles.label}>Make</Text>
                    <Controller
                        control={control}
                        name="make"
                        rules={{ required: "Required" }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.input, errors.make && styles.inputError]}
                                placeholder="e.g. Audi"
                                placeholderTextColor="#475569"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                    {errors.make && <Text style={styles.errorHint}>{errors.make.message}</Text>}

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <Text style={styles.label}>Year</Text>
                            <Controller
                                control={control}
                                name="year"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        onChangeText={val => onChange(Number(val))}
                                        value={value?.toString()}
                                    />
                                )}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Price (€)</Text>
                            <Controller
                                control={control}
                                name="price"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        keyboardType="numeric"
                                        onChangeText={val => onChange(Number(val))}
                                        value={value?.toString()}
                                    />
                                )}
                            />
                        </View>
                    </View>

                    <View style={styles.descHeader}>
                        <Text style={styles.label}>Description</Text>
                        <Text style={styles.charCount}>{descriptionValue.length} / {MAX_CHARS}</Text>
                    </View>
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                multiline
                                numberOfLines={10}
                                textAlignVertical="top"
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />

                    <Text style={styles.label}>Photos ({imagePreview.length}/10)</Text>
                    <View style={styles.imageGrid}>
                        {imagePreview.length < 10 && (
                            <TouchableOpacity style={styles.uploadBtn} onPress={handleImageChange}>
                                <Text style={styles.uploadPlus}>+</Text>
                            </TouchableOpacity>
                        )}
                        {imagePreview.map((url, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri: getImageUrl(url) }} style={styles.image} />
                                <TouchableOpacity
                                    style={styles.removeBtn}
                                    onPress={() => onRemoveImage?.(index)}
                                >
                                    <Text style={styles.removeText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    <View style={styles.buttonSection}>
                        <TouchableOpacity
                            style={styles.submitBtn}
                            disabled={loading}
                            onPress={onFormSubmit}
                        >
                            {loading ? (
                                <ActivityIndicator color="#0f172a" />
                            ) : (
                                <Text style={styles.submitBtnText}>{submitLabel}</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.cancelBtn}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a' },
    content: { padding: 16 },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 32,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.5)',
    },
    header: { marginBottom: 24, alignItems: 'center' },
    title: { fontSize: 28, fontWeight: '900', color: 'white' },
    subtitle: { color: '#64748b', fontSize: 14 },
    label: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 6,
        marginLeft: 4,
    },
    input: {
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 12,
        padding: 12,
        color: 'white',
        fontSize: 14,
        marginBottom: 16,
    },
    inputError: { borderColor: '#ef4444' },
    textArea: { minHeight: 120 },
    row: { flexDirection: 'row', marginBottom: 16 },
    errorBox: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    errorText: { color: '#ef4444', textAlign: 'center', fontSize: 13 },
    errorHint: { color: '#ef4444', fontSize: 10, marginTop: -12, marginBottom: 12, marginLeft: 4 },
    imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    uploadBtn: {
        width: 70,
        height: 70,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#334155',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadPlus: { color: '#70FFE2', fontSize: 24 },
    imageWrapper: { width: 70, height: 70, borderRadius: 12, overflow: 'hidden', position: 'relative' },
    image: { width: '100%', height: '100%' },
    removeBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        padding: 4,
    },
    removeText: { color: 'white', fontSize: 10 },
    submitBtn: {
        backgroundColor: '#70FFE2',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    submitBtnText: { color: '#0f172a', fontWeight: '900', fontSize: 18 },
    cancelBtn: { marginTop: 12, alignItems: 'center' },
    cancelBtnText: { color: '#64748b' },
    descHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    charCount: { fontSize: 10, color: '#64748b' },
    formSection: { marginTop: 10 },
    buttonSection: { marginTop: 10 }
});

export default CarForm;