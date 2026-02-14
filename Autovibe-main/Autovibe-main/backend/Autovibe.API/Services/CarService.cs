using Autovibe.API.Data;
using Autovibe.API.DTOs.Cars;
using Autovibe.API.Exceptions;
using Autovibe.API.Models;
using Microsoft.EntityFrameworkCore;
using Autovibe.API.Interfaces;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using System.Reflection.Metadata;

namespace Autovibe.API.Services
{

    public class CarService(AppDbContext context) : ICarService
    {
        private readonly AppDbContext _context = context;

        public async Task<CarDetailsDto?> UpdateAsync(int id, CarUpdateDto request, int userId)
        {
            var car = await _context.Cars.FirstOrDefaultAsync(c => c.Id == id);
            if (car == null || car.UserId != userId)
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
            car.UpdatedAt = DateTime.UtcNow;

            car.ImageUrls = request.ImageUrls;

            await _context.SaveChangesAsync();


            return new CarDetailsDto
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

        public async Task<CarDetailsDto?> CreateAsync(CarCreateDto request, int userId)
        {
            var car = new Car
            {
                Make = request.Make,
                Model = request.Model,
                Year = request.Year,
                Price = request.Price,
                Mileage = request.Mileage,
                FuelType = request.FuelType,
                Transmission = request.Transmission,
                Color = request.Color,
                Description = request.Description,
                CreatedAt = DateTime.Now,
                UpdatedAt = null,
                ImageUrls = request.ImageUrls,
                UserId = userId
            };

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();
            await _context.Entry(car).Reference(c => c.User).LoadAsync();

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
                SellerFirstName = car.User.FirstName,
                SellerLastName = car.User.LastName,
                SellerPhoneNumber = car.User.PhoneNumber,

                ImageUrls = car.ImageUrls
            };
        }

        public async Task<CarDetailsDto?> GetCarDetailsAsync(int id)
        {
            var car = await _context.Cars
                        .Include(c => c.User)
                        .FirstOrDefaultAsync(c => c.Id == id);
            if (car == null)
            {
                throw new NotFoundException("Car not found");
            }
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
                SellerFirstName = car.User.FirstName,
                SellerLastName = car.User.LastName,
                SellerPhoneNumber = car.User.PhoneNumber,

                ImageUrls = car.ImageUrls ?? new List<string>()
            };
        }

        public async Task<PageResponse<CarListDto>> GetAllAsync(int pageNumber, int pageSize)
        {
            var query = _context.Cars.AsQueryable();
            var totalItems = await query.CountAsync();

            var cars = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CarListDto
                {
                    Id = c.Id,
                    Make = c.Make,
                    Model = c.Model,
                    Year = c.Year,
                    Price = c.Price,
                    Mileage = c.Mileage,
                    FuelType = c.FuelType,
                    Transmission = c.Transmission,
                    Color = c.Color,
                    ShortDescription = c.Description != null && c.Description.Length > 100
                    ? c.Description.Substring(0, 100) + "..."
                    : c.Description,
                    UserId = c.UserId,
                    ImageUrls = c.ImageUrls ?? new List<string>()
                }).ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            return new PageResponse<CarListDto>
            {
                Items = cars,
                TotalPages = totalPages,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task DeleteAsync(int id, int userId)
        {
            var car = await _context.Cars.FirstOrDefaultAsync(c => c.Id == id);
            if (car == null || car.UserId != userId)
            {
                throw new NotFoundException("Car not found or you do not have permission to delete this car.");
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is null or empty.");
            }
            const long maxFileSize = 5 * 1024 * 1024; // 5MB
            if (file.Length > maxFileSize)
            {
                throw new ArgumentException("File size exceeds the maximum allowed size of 5MB.");
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                throw new ArgumentException("Invalid file type. Only images are allowed.");
            }

                string folderPath = Path.Combine("images", "cars");
                string serverPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folderPath);
            if (!Directory.Exists(serverPath))
            {
                Directory.CreateDirectory(serverPath);
            }
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var fullPath = Path.Combine(serverPath, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/images/cars/{fileName}";
        }
    }
}