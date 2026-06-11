using Autovibe.API.Models;
using Autovibe.API.DTOs.Cars;
using Autovibe.API.DTOs.Users;
using Mapster;

namespace Autovibe.API.Services.Helpers
{
    public static class CarMapping
    {
        public static CarListDto ListDto(this Car c)
        {
            return c.Adapt<CarListDto>();
        }

        public static CarDetailsDto DetailsDto(this Car c)
        {
            return c.Adapt<CarDetailsDto>();
        }
        public static Car ToEntity(this CarUpdateDto request, int userId)
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
                SteeringWheel = request.SteeringWheel,
                Condition = request.Condition,


                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,

                ImageUrls = request.ImageUrls ?? new List<string>(),

                UserId = userId

            };
        }
        public static void ApplyTo(this CarUpdateDto request, Car car)
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
            car.SteeringWheel = request.SteeringWheel;
            car.Condition = request.Condition;
            car.ImageUrls = request.ImageUrls ?? new List<string>();
            car.UpdatedAt = DateTime.UtcNow;
        }

        public static UserDto UserListDto (this User u)
        {
            return u.Adapt<UserDto>();
        
        }
    }
}