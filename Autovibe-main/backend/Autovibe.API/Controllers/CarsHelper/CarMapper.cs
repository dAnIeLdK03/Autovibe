using Autovibe.API.DTOs.Cars;
using Autovibe.API.Models;

namespace Autovibe.API.Controllers.CarsHelper
{
    public static class CarMapper
    {
        public static CarDetailsDto ToDetailsDto(this Car car, User? seller)
        {
            if (car == null) throw new ArgumentNullException(nameof(car));

            return new CarDetailsDto
            {
                Id = car.Id,
                Make = car.Make,
                Model = car.Model,
                Year = car.Year,
                Price = car.Price,
                Mileage = car.Mileage,
                FuelType = car.FuelType,
                Transmission = car.Transmission,
                Color = car.Color,
                Description = car.Description,
                CreatedAt = car.CreatedAt,
                UpdatedAt = car.UpdatedAt,

                SellerId = car.UserId,
                SellerFirstName = car.User?.FirstName ?? "Unknown",
            SellerLastName = car.User?.LastName ?? "Unknown",
            SellerPhoneNumber = car.User?.PhoneNumber,

                ImageUrls = car.ImageUrls ?? new List<string>()
            };
        }
    }
}