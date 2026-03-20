import { useState } from 'react';
import { useCarCreate } from './useCarCreate';
import { FormProvider } from 'react-hook-form';
import CarForm from '../../components/Car/CarForm';

export function CarCreate() {
  const {
    methods, 
    imagePreview, 
    handleImageChange, 
    onSubmit,
    removeImage
    } = useCarCreate();
  const [error, ] = useState(false);
    
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">

        <CarForm handleImageChange={handleImageChange} imagePreview={imagePreview} submitLabel='Create' title='Create Ad' onRemoveImage={removeImage}/>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </FormProvider>
  );
}

export default CarCreate;