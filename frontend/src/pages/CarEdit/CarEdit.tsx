import { FormProvider} from "react-hook-form";
import CarForm from "../../components/Car/CarForm";
import { useCarEdit } from "./useCarEdit";
import { useState } from "react";

export default function CarEdit() {
  const {
  methods, 
  imagePreview, 
  handleImageChange, 
  onSubmit
  } = useCarEdit();
const [error, ] = useState(false);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <CarForm handleImageChange={handleImageChange} imagePreview={imagePreview} submitLabel="Edit" title="Edit Ad" />
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </FormProvider>
  );
}
