import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { RootState } from "../../stores/store";
import { useForm } from "react-hook-form";
import type { CarFormValues } from "../../Validations/CarValidations/CarCreateValidaions";
import { setError, clearError, setLoading } from '../../stores/carsSlice'; // Добавих setLoading
import { uploadCarImageIfPresent } from "../../Validations/CarValidations/CarSubmitHelpers";
import CarCreateValidaions from "../../Validations/CarValidations/CarCreateValidaions";
import { createCar } from "../../services/carsService";
import toast from "react-hot-toast";

export const useCarCreate = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const methods = useForm<CarFormValues>();

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

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

      navigate("/cars");
      toast.success("Car created successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Failed to create car.";
      dispatch(setError(msg));
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviews = files.map(file => URL.createObjectURL(file));

      setImagePreview(prev => [...prev, ...newPreviews]);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setImagePreview(prev => {
      const urlToRemove = prev[index];
      if (urlToRemove && typeof urlToRemove === 'string' && urlToRemove.startsWith('blob')) {
        URL.revokeObjectURL(urlToRemove);
      }
      return prev.filter((_, i) => i !== index);
    });
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      imagePreview.forEach(url => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreview]);

  return {
    methods,
    imagePreview,
    handleImageChange,
    removeImage,
    onSubmit
  };
};