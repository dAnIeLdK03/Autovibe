import type { Car } from "../../stores/carsSlice";

export default function matchesFilters(car: Car, filters: {
  fuelType: string;
  transmission: string;
  mileageFilter: string;
}) {
  const matchesFuel =
    filters.fuelType === "Fuel" ||
    car.fuelType === filters.fuelType;

  const matchesTransmission =
    filters.transmission === "Transmission" ||
    car.transmission === filters.transmission;

  const matchesMileage = (() => {
  switch (filters.mileageFilter) {
     case "Mileage":
    default:
      return true;
    case "to 10000":
      return car.mileage <= 10000;
    case "to 20000":
      return car.mileage <= 20000;
    case "to 50000":
      return car.mileage <= 50000;
    case "to 100000":
      return car.mileage <= 100000;
    case "to 150000":
      return car.mileage <= 150000;
    case "to 200000":
      return car.mileage <= 200000;
    case "to 250000":
      return car.mileage <= 250000;
    case "to 300000":
      return car.mileage <= 300000;
    case "over 300000":
      return car.mileage > 300000;
   
  }
  })();

  return matchesFuel && matchesTransmission && matchesMileage;
}
