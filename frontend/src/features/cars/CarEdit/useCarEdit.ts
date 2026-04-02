import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import type { RootState } from "../../../stores/store";
import { getCarById, updateCar } from "../../../api/carsService";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { setLoading, setError, clearError } from '../../../stores/carsSlice';
import type { CarFormValues } from "../CarComponents/CarValidations/CarCreateValidaions";
import { useError } from "../../../shared/CustomHooks/useError";
import CarCreateValidaions from "../CarComponents/CarValidations/CarCreateValidaions";
import { uploadCarImageIfPresent } from "../CarComponents/CarValidations/CarSubmitHelpers";


export const useCarEdit = () => {
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sellerId, setSellerId] = useState<number | null>(null);


  const methods = useForm<CarFormValues>();
  const { reset } = methods;
  const {handleError} = useError();

  useEffect(() => {
    const fetchCar = async () => {
      if (!id || !user?.id) return;
      dispatch(setLoading(true));
      dispatch(clearError());
      try {
        const data = await getCarById(Number(id));
        const fetchedSellerId = data.sellerId;
        setSellerId(fetchedSellerId == null ? null : Number(fetchedSellerId));

        reset({ ...data });

        if (data.imageUrls && data.imageUrls.length > 0) {
          setImagePreview(
            (data.imageUrls ?? []).filter(
              (u): u is string => typeof u === "string" && u.length > 0
            )
          );
        }

        if (fetchedSellerId == null || Number(fetchedSellerId) !== Number(user.id)) {
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

    const errorMessage = CarCreateValidaions(formData);
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
      newImageUrls = uploadResult.imageUrls;
    }

    const remainingOldImageUrls = imagePreview.filter(
      (url): url is string => typeof url === "string" && !url.startsWith("blob")
    );

    const finalImageUrls = [...remainingOldImageUrls, ...newImageUrls].filter(
      (u): u is string => typeof u === "string" && u.length > 0
    );

    await updateCar(
      Number(id),
      {
        ...formData,
        description: formData.description ?? '',
      }, 
      finalImageUrls
    );

    navigate(`/cars/${id}`);
    toast.success("Car updated successfully!");
  }
  catch (error) {
    handleError(error);
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
    onSubmit,
    loading: !id
  }
}