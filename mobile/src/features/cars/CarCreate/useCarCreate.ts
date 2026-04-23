import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../stores/store";
import { useForm } from "react-hook-form";
import { clearError, setError, setLoading } from "../../../stores/carsSlice";
import { createCar } from "../../../api/carsService";
import { useError } from "../../../shared/hooks/useError";
import CarCreateValidaions, { CarFormValues } from "../CarComponents/CarValidations/CarCreateValidations";
import { uploadCarImageIfPresent } from "../CarComponents/CarValidations/CarSubmitHelper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/types";
import * as ImagePicker from 'expo-image-picker';

export interface ImageFile {
    uri: string;
    name: string;
    type: string;
}

export const useCarCreate = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();

    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<ImageFile[]>([]);

    const { handleError } = useError();
    const methods = useForm<CarFormValues>();

    useEffect(() => {
        if (user === null) {
            navigation.navigate("Login");
        }
    }, [user]);

    const onSubmit = async (formData: CarFormValues) => {
        dispatch(clearError());

        const errorMessage = CarCreateValidaions(formData);
        if (errorMessage) {
            dispatch(setError(errorMessage));
            return;
        }

        dispatch(setLoading(true));

        try {
            const uploadResult = await uploadCarImageIfPresent(selectedFiles);

            if (uploadResult.error) {
                dispatch(setError(uploadResult.error));
                dispatch(setLoading(false));
                return;
            }

            await createCar({
                ...formData,
                description: formData.description ?? '',
                imageUrls: uploadResult.imageUrls
            });

            navigation.navigate("CarList");
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleImageChange = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            const newFiles: ImageFile[] = result.assets.map((asset: ImagePicker.ImagePickerAsset) => ({
                uri: asset.uri,
                name: asset.fileName || `image_${Date.now()}.jpg`,
                type: asset.mimeType || 'image/jpeg'
            }));

            const newPreviews = result.assets.map((asset: ImagePicker.ImagePickerAsset) => asset.uri);

            setImagePreview(prev => [...prev, ...newPreviews]);
            setSelectedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeImage = (index: number) => {
        setImagePreview(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return {
        methods,
        imagePreview,
        handleImageChange,
        removeImage,
        onSubmit
    };
};