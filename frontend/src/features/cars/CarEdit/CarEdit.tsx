import { FormProvider} from "react-hook-form";
import CarForm from "../CarComponents/CarForm"; 
import { useCarEdit } from "./useCarEdit";

export default function CarEdit() {
  const {
  methods, 
  imagePreview, 
  handleImageChange, 
  onSubmit,
  removeImage
  } = useCarEdit();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <CarForm handleImageChange={handleImageChange} imagePreview={imagePreview} submitLabel="Edit" title="Edit Ad" onRemoveImage={removeImage} />
      </form>
    </FormProvider>
  );
}
