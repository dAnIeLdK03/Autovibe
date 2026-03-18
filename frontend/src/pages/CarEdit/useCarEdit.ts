import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import type { RootState } from "../../stores/store";
import { getCarById, updateCar } from "../../services/carsService";
import { useForm } from "react-hook-form";
import type { CarFormValues } from "../../Validations/CarValidations/CarCreateValidaions";
import { uploadCarImageIfPresent } from "../../Validations/CarValidations/CarSubmitHelpers";
import CarCreateValidaions from "../../Validations/CarValidations/CarCreateValidaions";
import toast from "react-hot-toast";
import { setLoading, setError, clearError } from '../../stores/carsSlice';


export const useCarEdit = () => {
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
  
    const methods = useForm<CarFormValues>();
    const { reset } = methods;

    useEffect(() => {
        const fetchCar = async () => {
          if (!id || !user?.id) return;
          dispatch(setLoading(true));
          dispatch(clearError());
          try {
            const data = await getCarById(Number(id));
            if (data.sellerId !== user.id) {
              dispatch(setError("You are not allowed to edit this car."));
              return;
            }
    
            reset({
              make: data.make,
              model: data.model,
              year: data.year,
              price: data.price,
              mileage: data.mileage,
              power: data.power,
              fuelType: data.fuelType,
              transmission: data.transmission,
              color: data.color,
              description: data.description,
    
            });
    
            if(data.imageUrls && data.imageUrls.length > 0) {
              setImagePreview(data.imageUrls[0]);
            }
    
          } catch {
            dispatch(setError("Unable to load car."));
          } finally {
            dispatch(setLoading(false));
          }
        };
        fetchCar();
      }, [id, user?.id, reset, navigate, setImagePreview]);


      const onSubmit = async (formData: CarFormValues) => {
    if (!id) return;
    dispatch(clearError());

    const uploadResult = await uploadCarImageIfPresent(imageFile);
    if (uploadResult.error) {
     dispatch( setError(uploadResult.error));
      return;
    }
    const errorMessage = CarCreateValidaions(formData);

    if (errorMessage) {
      dispatch(setError(errorMessage));
      return;
    }


    dispatch(setLoading(true));
    try {
      await updateCar(
        Number(id),
        {
          ...formData,
          description: formData.description ?? '',
        },uploadResult.imageUrls
      );
      navigate(`/cars/${id}`);
      toast.success("Car updated successfully!");
    } catch (error: any) {
      dispatch(setError(error.response.data?.message ?? "Failed to update car."));
    } finally {
      dispatch(setLoading(false));
    }
  };

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImageFile(file);
      setImagePreview(file ? URL.createObjectURL(file) : null);
    };
  
    useEffect(() => {
      return () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
      };
    }, [imagePreview]);
  
    return { 
        methods,
        imagePreview,
        handleImageChange, 
        onSubmit,
        loading: !id
    }
}