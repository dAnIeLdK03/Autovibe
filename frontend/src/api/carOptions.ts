
export const fuelTypeOptions = [
  {id: 'Fuel', label: 'Fuel'},
  {id: 'Petrol', label:'Petrol'},
  {id: 'Diesel', label:'Diesel'},
  {id: 'Hybrid', label:'Hybrid'},
];

export const MileagеTypes = [
    {id: 'Mileage', label:'Mileage'},
    {id: 'to 10000', label: 'to 10000'},
    {id: 'to 20000', label: 'to 20000'},
    {id: 'to 50000', label: 'to 50000'},
    {id: 'to 100000', label: 'to 100000'},
    {id: 'to 150000', label: 'to 150000'},
    {id: 'to 200000', label: 'to 200000'},
    {id: 'to 250000', label: 'to 250000'},
    {id: 'to 300000', label: 'to 300000'},
    {id: 'over 300000', label: 'over 300000'},
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
    updateSort: (key: string, value: string) => void;
    onApply: () => void;
};

export const transmissionTypes = [
    { id: 'Transmission', label: 'Transmission' },
    { id: 'Manual', label: 'Manual' },
    { id: 'Automatic', label: 'Automatic' },
];

export const bodyTypes = [
  { id: 'All', label: 'All'},
  { id: 'Sedan', label: 'Sedan'},
  { id: 'Coupe', label: 'Coupe'},
  { id: 'hatchback', label: 'hatchback'},
  { id: 'Cabrio', label: 'Cabrio'},
  { id: 'SUV', label: 'SUV'},
  { id: 'Pickup truck', label: 'Pickup truck'},
  { id: 'Wagon', label: 'Wagon'},
  { id: 'Van', label: 'Van'},
];