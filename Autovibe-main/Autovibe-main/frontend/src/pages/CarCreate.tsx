import type { RootState } from '../stores/store';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCar } from '../services/carsService';
import CarCreateValidaions from "../Validations/CarValidations/CarCreateValidaions";
import { uploadCarImageIfPresent } from "../Validations/CarValidations/CarSubmitHelpers";
import { FormProvider, useForm } from 'react-hook-form';
import type { CarFormValues } from "../Validations/CarValidations/CarCreateValidaions";
import CarForm from '../components/Car/CarForm';

export function CarCreate() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const methods = useForm<CarFormValues>();

  if (user === null) {
    navigate("/login");
    return null;
  }

  const onSubmit = async (formData: CarFormValues) => {
    setError(null);

    const uploadResult = await uploadCarImageIfPresent(imageFile);
    if (uploadResult.error) {
      setError(uploadResult.error);
      return;
    }

    const errorMessage = CarCreateValidaions(formData);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    try {
      await createCar({
        ...formData,
        description: formData.description ?? '',
        imageUrls: uploadResult.imageUrls
      });

      navigate("/cars");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to create car.");
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

  return (
    
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">

        <CarForm handleImageChange={handleImageChange} imagePreview={imagePreview} submitLabel='Create' title='Create Ad'/>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </FormProvider>
  );
}

export default CarCreate;