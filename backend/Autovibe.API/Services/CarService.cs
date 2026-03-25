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
using Autovibe.API.Services.Helpers;
using System.Runtime.CompilerServices;



namespace Autovibe.API.Services
{

    public class CarService : ICarService
    {
        private readonly AppDbContext _context;

        public CarService(
            AppDbContext context
        )
        {
            _context = context;
        }
        public async Task<CarDetailsDto?> UpdateAsync(int id, CarUpdateDto request, int userId)
        {
            var car = await _context.Cars.FirstOrDefaultAsync(c => c.Id == id);

            car.ThrowIfNull($"Car with id {id} was not found");
            
            car.ThrowIfForbidden(car.UserId != userId, "You do not have permission do update this car");

            request.ApplyTo(car, userId);
            await _context.SaveChangesAsync();
            await _context.Entry(car).Reference(c => c.User).LoadAsync();


            return car.DetailsDto();
        }

        public async Task<CarDetailsDto?> CreateAsync(CarCreateDto request, int userId)
        {
            Car car = request.ToEntity(userId);
            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            await _context.Entry(car).Reference(c => c.User).LoadAsync();

            return car.DetailsDto();
        }

        public async Task<CarDetailsDto?> GetCarDetailsAsync(int id)
        {
            var car = await _context.Cars
                        .Include(c => c.User)
                        .FirstOrDefaultAsync(c => c.Id == id);
           
            return car.ThrowIfNull($"Car with id {id} was not found")!.DetailsDto();
        }

        public async Task<PageResponse<CarListDto>> GetAllAsync(CarFiltersDto request, int pageNumber, int pageSize)
        {

            pageNumber.ThrowIfLessThan(1, "Page number cannot be less than 1.");

            pageSize.THrowIfLessThanAndMoreThan(1,9, "Page size cannot be less than 1 or greater than 9.");


            var query = _context.Cars.AsQueryable();

            query = query.ApplyFilters(request)
                         .ApplySorting(request.SortType);

            var totalItems = await query.CountAsync();

            var cars = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(c => c.ListDto())
                .ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalItems / request.PageSize);

            return new PageResponse<CarListDto>
            {
                Items = cars,
                TotalPages = totalPages,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }

        public async Task DeleteAsync(int id, int userId)
        {
            var car = await _context.Cars.FirstOrDefaultAsync(c => c.Id == id);
            car.ThrowIfNull($"Car with id {id} was not found");

            car.ThrowIfForbidden(car.UserId != userId, "You do not have permission do update this car");

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            file.ThrowIfNull("File is null or empty.");

            const long maxFileSize = 5 * 1024 * 1024; // 5MB
            
            file.ThrowIfTooLarge(maxFileSize, "File size exceeds the maximum allowed size of 5MB.");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                throw new BadRequestException("Invalid file type. Only images are allowed.");
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

        public async Task<PageResponse<CarListDto>> GetUserCarsAsync(int userId, int pageNumber, int pageSize)
        {
            pageNumber.ThrowIfLessThan(1, "Page number cannot be less than 1.");

            pageSize.THrowIfLessThanAndMoreThan(1,9, "Page size cannot be less than 1 or greater than 9.");

            var query = _context.Cars
            .AsNoTracking()
            .Where(c => c.UserId == userId);

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(c => c.ListDto())
                .ToListAsync();

            return new PageResponse<CarListDto>
            {
                Items = items,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }
}