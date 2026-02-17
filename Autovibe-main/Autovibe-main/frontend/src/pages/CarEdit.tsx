import type { RootState } from "../stores/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { getCarById, updateCar } from "../services/carsService";
import CarCreateValidaions, { type CarFormValues } from "../Validations/CarValidations/CarCreateValidaions";
import { uploadCarImageIfPresent } from "../Validations/CarValidations/CarSubmitHelpers";
import { FormProvider, useForm } from "react-hook-form";
import CarForm from "../components/Car/CarForm";

export default function CarEdit() {
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);

  const [error, setError] = useState<string | null>(null);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();

const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const methods = useForm<CarFormValues>();
  const { reset } = methods;


  useEffect(() => {
    const fetchCar = async () => {
      if (!id || !user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getCarById(Number(id));
        if (data.sellerId !== user.id) {
          setError("You are not allowed to edit this car.");
          return;
        }

        reset({
          make: data.make,
          model: data.model,
          year: data.year,
          price: data.price,
          mileage: data.mileage,
          fuelType: data.fuelType,
          transmission: data.transmission,
          color: data.color,
          description: data.description,

        });

        if(data.imageUrls && data.imageUrls.length > 0) {
          setImagePreview(data.imageUrls[0]);
        }

      } catch {
        setError("Unable to load car.");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, user?.id, reset, navigate, setImagePreview]);



  const onSubmit = async (formData: CarFormValues) => {
    if (!id) return;
    setError(null);

    const uploadResult = await uploadCarImageIfPresent(imageFile);
    if (uploadResult.error) {
      setError(uploadResult.error);
      return;
    }
    // Client-side validation
    const errorMessage = CarCreateValidaions(formData);

    if (errorMessage) {
      setError(errorMessage);
      return;
    }


    setLoading(true);
    try {
      await updateCar(
        Number(id),
        {
          ...formData,
          description: formData.description ?? '',
        },uploadResult.imageUrls
      );
      navigate("/cars");
    } catch (error: any) {
      setError(error.response.data?.message ?? "Failed to update car.");
    } finally {
      setLoading(false);
    }
  };


  if (!id) {
    return <h2>No car selected.</h2>;
  }

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

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <CarForm handleImageChange={handleImageChange} imagePreview={imagePreview} submitLabel="Edit" title="Edit Ad" />
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </FormProvider>
  );
}
