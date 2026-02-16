export interface CarFormValues {
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    color: string;
    shortDescription?: string;
    /** Used in CarCreate; validation checks this when shortDescription is missing */
    description: string;
}

const CarCreateValidaions = (form : CarFormValues) : string | null => {
    if (!form.make.trim() || !form?.make) {
        return "Make is Required.";
    }
        if (!form.model.trim()) {
          return "Model is Required.";
        }
        if (form.year < 1900 || form.year > new Date().getFullYear()) {
                return " The year must be between 1900 and current year.";
            }
        if (form.price <= 0) {
          return "Price must be greater than 0.";
        }
       
        const desc = (form.shortDescription ?? form.description) ?? "";
        if (desc.length < 10 || desc.trim() === "") {
            return "Short description must be at least 10 characters long.";
        }
        if(form.mileage <= 0){
            return "Mileage must be greater than 0.";
        }
        if(form.fuelType.trim() === ""){
            return "Fuel type is required.";
        }
        if(form.transmission.trim() === ""){
            return "Transmission is required.";
        }
        if(form.color.trim() === ""){
            return "Color is required.";
        }
        return null;
        
};

export default CarCreateValidaions