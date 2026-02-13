

namespace Autovibe.API.Services;

public class CarService : ICarService
{
    private readonly AppDbContext _context;

    public CarService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CarResponseDto?> UpdateAsync(int id, UpdateCarRequest request, int userId)
    {
        var car = await _context.Cars.FirstOrDefaultAsync(c => c.Id = id);
        if(car == null || car.SellerId != userId)
        {
            throw new NotFoundException("Car not found or you do not have permission to update this car.");
        }
        car.Model = request.Model;
        car.Make = request.Make;
        car.Year = request.Year;
        car.Price = request.Price;
        car.Mileage = request.Mileage;
        car.FuelType = request.FuelType;
        car.Transmission = request.Transmission;
        car.Color = request.Color;
        car.Description = request.Description;
        car.UpdateAt = DateTime.UtcNow;

        car.ImageUrls = request.ImageUrls;

        await _context.SaveChangesAsync();

        return new CarResponseDto
        {
            Id = car.Id,
            Model = car.Model,
            Make = car.Make,
            Year = car.Year,
            Price = car.Price,
            Mileage = car.Mileage,
            FuelType = car.FuelType,
            Transmission = car.Transmission,
            Color = car.Color,
            Description = car.Description,
            ImageUrls = car.ImageUrls
        };
    }

    public async Task<CarResponseDto?> CreateAsync(CreateCarRequest request, int userId)
    {
        
    }
}