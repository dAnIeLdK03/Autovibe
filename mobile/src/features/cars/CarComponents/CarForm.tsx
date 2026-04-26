import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { CarFormValues } from './CarValidations/CarCreateValidations';
import type { RootState } from '@autovibe/app-state';
import { getImageUrl } from '../../../utils/getImageurl';
import { BaseSelect } from './Filters/BaseSelect';
import { bodyTypes, Condition, fuelTypeOptions, transmissionTypes, wheelTypes } from '../../../api/carOptions';

interface CarFormProps {
    handleImageChange: () => void;
    imagePreview: string[];
    submitLabel?: string;
    title: string;
    onRemoveImage?: (index: number) => void;
    onSubmit: (data: CarFormValues) => void;
}

function CarForm({ handleImageChange, imagePreview, onRemoveImage, submitLabel = "Create", title, onSubmit }: CarFormProps) {
    const { control, handleSubmit, formState: { errors }, watch } = useFormContext<CarFormValues>();
    const { error, loading } = useSelector((state: RootState) => state.cars);
    const navigation = useNavigation();

    const MAX_CHARS = 5000;
    const descriptionValue = watch("description") || "";
    const galleryImages = (imagePreview ?? []).slice(0, 10);

    const inputStyle = styles.input;
    const labelStyle = styles.label;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.card}>

                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle}>Fill in the technical specifications below</Text>
                    </View>

                    {error && (
                        <View style={styles.errorBanner}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <View style={{ gap: 20 }}>
                        <View style={styles.row}>
                            <View style={styles.flex1}>
                                <Text style={labelStyle}>Make</Text>
                                <Controller
                                    control={control}
                                    name="make"
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput style={inputStyle} placeholder="e.g. Audi" placeholderTextColor="#475569" value={value} onChangeText={onChange} />
                                    )}
                                />
                                {errors.make && <Text style={styles.errorMsg}>{errors.make.message}</Text>}
                            </View>
                            <View style={styles.flex1}>
                                <Text style={labelStyle}>Model</Text>
                                <Controller
                                    control={control}
                                    name="model"
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput style={inputStyle} placeholder="e.g. RS6" placeholderTextColor="#475569" value={value} onChangeText={onChange} />
                                    )}
                                />
                                {errors.model && <Text style={styles.errorMsg}>{errors.model.message}</Text>}
                            </View>
                        </View>

                        <View style={styles.grid}>
                            {[
                                { name: 'year', label: 'Year', placeholder: '2024' },
                                { name: 'price', label: 'Price (€)', placeholder: 'Price' },
                                { name: 'mileage', label: 'Km', placeholder: 'Mileage' },
                                { name: 'power', label: 'Power (hp)', placeholder: 'HP' }
                            ].map((item) => (
                                <View key={item.name} style={styles.gridItem}>
                                    <Text style={labelStyle}>{item.label}</Text>
                                    <Controller
                                        control={control}
                                        name={item.name as any}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                style={inputStyle}
                                                keyboardType="numeric"
                                                placeholder={item.placeholder}
                                                placeholderTextColor="#475569"
                                                value={value?.toString()}
                                                onChangeText={(val) => onChange(val ? Number(val) : '')}
                                            />
                                        )}
                                    />
                                </View>
                            ))}
                        </View>

                        <View style={styles.row}>
                            <View style={styles.flex1}>
                                <Text style={labelStyle}>Color</Text>
                                <Controller
                                    control={control}
                                    name="color"
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput style={inputStyle} placeholder="Color" placeholderTextColor="#475569" value={value} onChangeText={onChange} />
                                    )}
                                />
                            </View>
                            <View style={styles.flex1}>
                                <Text style={labelStyle}>Location</Text>
                                <Controller
                                    control={control}
                                    name="location"
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput style={inputStyle} placeholder="Location" placeholderTextColor="#475569" value={value} onChangeText={onChange} />
                                    )}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.flex1}>
                                <Controller
                                    control={control}
                                    name="fuelType"
                                    render={({ field: { onChange, value } }) => (
                                        <BaseSelect label="Fuel" variant="dropdown" options={fuelTypeOptions} value={value} onChange={onChange} />
                                    )}
                                />
                            </View>
                            <View style={styles.flex1}>
                                <Controller
                                    control={control}
                                    name="bodyType"
                                    render={({ field: { onChange, value } }) => (
                                        <BaseSelect label="Body Type" variant="dropdown" options={bodyTypes} value={value} onChange={onChange} />
                                    )}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.flex1}>
                                <Controller
                                    control={control}
                                    name="transmission"
                                    render={({ field: { onChange, value } }) => (
                                        <BaseSelect label="Transmission" variant="dropdown" options={transmissionTypes} value={value} onChange={onChange} />
                                    )}
                                />
                            </View>
                            <View style={styles.flex1}>
                                <Controller
                                    control={control}
                                    name="steeringWheel"
                                    render={({ field: { onChange, value } }) => (
                                        <BaseSelect label="Steering" variant="dropdown" options={wheelTypes} value={value} onChange={onChange} />
                                    )}
                                />
                            </View>
                        </View>

                        <Controller
                            control={control}
                            name="condition"
                            render={({ field: { onChange, value } }) => (
                                <BaseSelect label="Condition" variant="dropdown" options={Condition} value={value} onChange={onChange} />
                            )}
                        />

                        <View>
                            <View style={styles.rowBetween}>
                                <Text style={labelStyle}>Description</Text>
                                <Text style={[styles.charCount, descriptionValue.length > MAX_CHARS && { color: '#ef4444' }]}>
                                    {descriptionValue.length} / {MAX_CHARS}
                                </Text>
                            </View>
                            <Controller
                                control={control}
                                name="description"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={[inputStyle, styles.textArea]}
                                        multiline
                                        placeholder="Describe your vehicle..."
                                        placeholderTextColor="#475569"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                )}
                            />
                            {errors.description && <Text style={styles.errorMsg}>{errors.description.message}</Text>}
                        </View>

                        <View>
                            <Text style={labelStyle}>Photos ({galleryImages.length}/10)</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoContainer}>
                                {galleryImages.length < 10 && (
                                    <TouchableOpacity style={styles.imagePickerBtn} onPress={handleImageChange}>
                                        <Text style={styles.plusIcon}>+</Text>
                                    </TouchableOpacity>
                                )}
                                {galleryImages.map((url, index) => (
                                    <View key={index} style={styles.imageWrapper}>
                                        <Image source={{ uri: getImageUrl(url) }} style={styles.image} />
                                        <TouchableOpacity style={styles.removeBtn} onPress={() => onRemoveImage?.(index)}>
                                            <Text style={styles.removeText}>✕</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.submitBtn}
                                disabled={loading}
                                onPress={handleSubmit(onSubmit)}
                                activeOpacity={0.8}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#0f172a" />
                                ) : (
                                    <Text style={styles.submitBtnText}>{submitLabel}</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.6}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a' },
    scrollContent: { paddingVertical: 20, paddingHorizontal: 16 },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 32,
        padding: 20,
        borderWidth: 1,
        borderColor: '#1e293b',
    },
    header: { alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 28, fontWeight: '900', color: '#fff' },
    subtitle: { color: '#64748b', fontSize: 13, marginTop: 4 },
    label: { fontSize: 11, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: 6, marginLeft: 4 },
    input: {
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderWidth: 1,
        borderColor: '#1e293b',
        borderRadius: 12,
        padding: 12,
        color: '#fff',
        fontSize: 14,
    },
    textArea: { height: 150, textAlignVertical: 'top' },
    row: { flexDirection: 'row', gap: 12 },
    flex1: { flex: 1 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    gridItem: { width: '47%' },
    errorBanner: { backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#ef4444' },
    errorText: { color: '#ef4444', textAlign: 'center', fontSize: 12 },
    errorMsg: { color: '#ef4444', fontSize: 10, marginTop: 4 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    charCount: { fontSize: 10, color: '#64748b' },
    photoContainer: { flexDirection: 'row', marginTop: 10 },
    imagePickerBtn: { width: 80, height: 80, backgroundColor: '#0f172a', borderStyle: 'dashed', borderWidth: 1, borderColor: '#334155', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    plusIcon: { color: '#70FFE2', fontSize: 24 },
    imageWrapper: { width: 80, height: 80, marginRight: 10, borderRadius: 16, overflow: 'hidden', position: 'relative' },
    image: { width: '100%', height: '100%' },
    removeBtn: { position: 'absolute', inset: 0, backgroundColor: 'rgba(220, 38, 38, 0.6)', justifyContent: 'center', alignItems: 'center' },
    removeText: { color: '#fff', fontWeight: 'bold' },
    footer: { marginTop: 10, gap: 15 },
    submitBtn: { backgroundColor: '#70FFE2', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
    submitBtnText: { color: '#0f172a', fontWeight: '900', fontSize: 16 },
    cancelText: { color: '#64748b', textAlign: 'center', fontSize: 14 }
});

export default CarForm;