using Autovibe.API.Models;
using Autovibe.API.DTOs.Cars;
namespace Autovibe.API.Services.Helpers
{
    public static class CarMapping
    {
        public static CarListDto ListDto(this Car c)
        {
            return new CarListDto
            {
                Id = c.Id,
                BodyType = c.BodyType,
                Make = c.Make,
                Model = c.Model,
                Year = c.Year,
                Price = c.Price,
                Mileage = c.Mileage,
                Power = c.Power,
                FuelType = c.FuelType,
                Transmission = c.Transmission,
                Color = c.Color,
                ShortDescription = c.Description != null && c.Description.Length > 100
                    ? c.Description.Substring(0, 100) + "..."
                    : c.Description,
                Location = c.Location,
                Published = c.Published,
                SteeringWheel = c.SteeringWheel,
                UserId = c.UserId,
                ImageUrls = c.ImageUrls ?? new List<string>()
            };
        }

        public static CarDetailsDto DetailsDto(this Car c)
        {
            return new CarDetailsDto
            {
                Id = c.Id,
                BodyType = c.BodyType,
                Make = c.Make,
                Model = c.Model,
                Year = c.Year,
                Price = c.Price,
                Mileage = c.Mileage,
                Power = c.Power,
                FuelType = c.FuelType,
                Transmission = c.Transmission,
                Color = c.Color,
                Description = c.Description,
                Location = c.Location,
                Published = c.Published,
                SteeringWheel = c.SteeringWheel,

                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,

                SellerId = c.UserId,
                SellerFirstName = c.User.FirstName,
                SellerLastName = c.User.LastName,
                SellerPhoneNumber = c.User.PhoneNumber,

                ImageUrls = c.ImageUrls
            };
        }
        public static Car ToEntity(this CarCreateDto request, int userId)
        {
            return new Car
            {
                BodyType = request.BodyType,
                Model = request.Model,
                Make = request.Make,
                Year = request.Year,
                Price = request.Price,
                Mileage = request.Mileage,
                Power = request.Power,
                FuelType = request.FuelType,
                Transmission = request.Transmission,
                Color = request.Color,
                Description = request.Description,
                Location = request.Location,
                Published = request.Published,
                SteeringWheel = request.SteeringWheel,

                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,

                ImageUrls = request.ImageUrls ?? new List<string>(),

                UserId = userId

            };
        }
        public static void ApplyTo(this CarUpdateDto request, Car car, int userId)
        {
            car.BodyType = request.BodyType;
            car.Make = request.Make;
            car.Model = request.Model;
            car.Year = request.Year;
            car.Price = request.Price;
            car.Mileage = request.Mileage;
            car.Power = request.Power;
            car.FuelType = request.FuelType;
            car.Transmission = request.Transmission;
            car.Color = request.Color;
            car.Description = request.Description;
            car.Location = request.Location;
            car.Published = request.Published;
            car.SteeringWheel = request.SteeringWheel;
            car.ImageUrls = request.ImageUrls ?? new List<string>();
            car.UpdatedAt = DateTime.UtcNow;
        }
    }
}