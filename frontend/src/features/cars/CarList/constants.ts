import type { CarFilters } from "../../../api/carsService";

const currentYear = new Date().getFullYear().toString();

export const initialFilters: CarFilters = {
  fuelType: "Fuel",
  transmission: "Transmission",
  mileage: "Mileage",
  yearRange: { min: "1900", max: currentYear },
  power: "",
  location: "",
  steeringWheel: "",
  condition: "All",
  published: "",
  sortType: "None"
}