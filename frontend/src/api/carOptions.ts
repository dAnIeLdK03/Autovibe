import type { CarFilters } from "./carsService";

export const fuelTypeOptions = [
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Hybrid', label: 'Hybrid' },
];

export const MileageTypes = [
  { value: 'to 10000', label: 'to 10000' },
  { value: 'to 20000', label: 'to 20000' },
  { value: 'to 50000', label: 'to 50000' },
  { value: 'to 100000', label: 'to 100000' },
  { value: 'to 150000', label: 'to 150000' },
  { value: 'to 200000', label: 'to 200000' },
  { value: 'to 250000', label: 'to 250000' },
  { value: 'to 300000', label: 'to 300000' },
  { value: 'over 300000', label: 'over 300000' },
];


export const sortOptions = [
  { id: 'None', label: 'Sort by' },
  { id: 'Newest', label: 'Newest' },
  { id: 'PriceAsc', label: 'Price: Asc' },
  { id: 'PriceDesc', label: 'Price: Dsc' },
  { id: 'YearDesc', label: 'Year' },
];

export interface SortedCarsProps {
  isOpen: boolean;
  onClose: () => void;
  sortOptionId: string;
  updateSort: (key: keyof CarFilters, value: CarFilters[keyof CarFilters]) => void;
  onApply: () => void;
};

export const transmissionTypes = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatic', label: 'Automatic' },
];

export const bodyTypes = [
  { value: 'Sedan', label: 'Sedan' },
  { value: 'Coupe', label: 'Coupe' },
  { value: 'Hatchback', label: 'Hatchback' },
  { value: 'Cabrio', label: 'Cabrio' },
  { value: 'SUV', label: 'SUV' },
  { value: 'Pickup truck', label: 'Pickup truck' },
  { value: 'Wagon', label: 'Wagon' },
  { value: 'Van', label: 'Van' },
];

export const wheelTypes = [
  { value: 'Left', label: 'Left' },
  { value: 'Right', label: 'Right' },
];

export const publishedOptions = [
  {value: "0", label: "Today"},
  {value: "3", label: "Last 3 days"},
  {value: "7", label: "Last 7 days"},
  {value: "14", label: "Last 14 days"},
  {value: "30", label: "Last 30 days"}
];

export const Condition = [
  {value:"All", label: "All"},
  {value:"New", label:"New"},
  {value:"Used", label:"Used"},
  {value:"Broken", label:"Broken"},
  {value:"Parts", label:"Parts"}
]