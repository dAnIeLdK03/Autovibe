import { useCarCreate } from './useCarCreate';
import { FormProvider } from 'react-hook-form';
import CarForm from '../CarComponents/CarForm'; 

export function CarCreate() {
  const {
    methods, 
    imagePreview, 
    handleImageChange, 
    onSubmit,
    removeImage
    } = useCarCreate();
    
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">

        <CarForm handleImageChange={handleImageChange} imagePreview={imagePreview} submitLabel='Create' title='Create Ad' onRemoveImage={removeImage}/>
      </form>
    </FormProvider>
  );
}

export default CarCreate;