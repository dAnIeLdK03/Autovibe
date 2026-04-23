import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../stores/store";
import { getCarById, updateCar } from "../../../api/carsService";
import { useForm } from "react-hook-form";
import { setLoading, setError, clearError } from '../../../stores/carsSlice';
import type { CarFormValues } from "../CarComponents/CarValidations/CarCreateValidations";
import CarCreateValidations from "../CarComponents/CarValidations/CarCreateValidations";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { useError } from "../../../shared/hooks/useError";
import { uploadCarImageIfPresent } from "../CarComponents/CarValidations/CarSubmitHelper";

export interface ImageFile {
  uri: string;
  name: string;
  type: string;
}

export const useCarEdit = () => {
  const route = useRoute<any>();
  const id = route.params?.id;
  const { user } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<ImageFile[]>([]);
  const [sellerId, setSellerId] = useState<number | null>(null);

  const methods = useForm<CarFormValues>();
  const { reset } = methods;
  const { handleError } = useError();

  useEffect(() => {
    const fetchCar = async () => {
      if (!id || !user?.id) return;
      dispatch(setLoading(true));
      dispatch(clearError());
      try {
        const data = await getCarById(Number(id));
        setSellerId(data.sellerId == null ? null : Number(data.sellerId));

        reset({ ...data });

        if (data.imageUrls && data.imageUrls.length > 0) {
          setImagePreview(data.imageUrls.filter((u: any) => typeof u === "string" && u.length > 0));
        }

        if (data.sellerId == null || Number(data.sellerId) !== Number(user.id)) {
          dispatch(setError("You are not allowed to edit this car."));
        }
      } catch {
        dispatch(setError("Unable to load car."));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchCar();
  }, [id, user?.id, reset, dispatch]);

  const onSubmit = async (formData: CarFormValues) => {
    if (!id) return;
    dispatch(clearError());

    if (sellerId == null || Number(sellerId) !== Number(user?.id)) {
      dispatch(setError("You are not allowed to edit this car."));
      return;
    }

    const errorMessage = CarCreateValidations(formData);
    if (errorMessage) {
      dispatch(setError(errorMessage));
      return;
    }

    dispatch(setLoading(true));

    try {
      let newImageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        const uploadResult = await uploadCarImageIfPresent(selectedFiles);
        if (uploadResult.error) {
          dispatch(setError(uploadResult.error));
          dispatch(setLoading(false));
          return;
        }
        newImageUrls = uploadResult.error ? [] : uploadResult.imageUrls;
      }

      const remainingOldImageUrls = imagePreview.filter(
        (url) => !url.startsWith("file://") && !url.startsWith("content://")
      );

      const finalImageUrls = [...remainingOldImageUrls, ...newImageUrls];

      await updateCar(
        Number(id),
        { ...formData, description: formData.description ?? '' },
        finalImageUrls
      );

      navigation.navigate("CarDetails", { id });
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
      const newFiles: ImageFile[] = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `image_${Date.now()}.jpg`,
        type: asset.mimeType || 'image/jpeg'
      }));

      setImagePreview(prev => [...prev, ...result.assets.map(a => a.uri)]);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    const removedUrl = imagePreview[index];
    
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    
    if (removedUrl.startsWith("file://") || removedUrl.startsWith("content://")) {
      setSelectedFiles(prev => prev.filter(f => f.uri !== removedUrl));
    }
  };

  return {
    methods,
    imagePreview,
    handleImageChange,
    removeImage,
    onSubmit,
    loading: !id
  };
};