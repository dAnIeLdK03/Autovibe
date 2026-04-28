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
using Microsoft.AspNetCore.Mvc;



namespace Autovibe.API.Services
{

    public class CarService : ICarService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CarService(
            AppDbContext context,
            IWebHostEnvironment env
        )
        {
            _context = context;
            _env = env;
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
                        .AsNoTracking()
                        .Include(c => c.User)
                        .FirstOrDefaultAsync(c => c.Id == id);
           
            return car.ThrowIfNull($"Car with id {id} was not found")!.DetailsDto();
        }

        public async Task<PageResponse<CarListDto>> GetAllAsync(CarFiltersDto request)
        {

            request.PageNumber.ThrowIfLessThan(1, "Page number cannot be less than 1.");

            request.PageSize.THrowIfLessThanAndMoreThan(1,18, "Page size cannot be less than 1 or greater than 18.");


            var query = _context.Cars
            .AsQueryable()
            .AsNoTracking();

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

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            var car = await _context.Cars.FirstOrDefaultAsync(c => c.Id == id);
            car.ThrowIfNull($"Car with id {id} was not found");

            car.ThrowIfForbidden(car.UserId != userId, "You do not have permission do update this car");

            car.IsDeleted=true;
            car.DeletedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            file.ThrowIfNull("File is null or empty.");

            const long maxFileSize = 5 * 1024 * 1024; // 5MB            
            file.ThrowIfTooLarge(maxFileSize, "File size exceeds the maximum allowed size of 5MB.");


            var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            file.ThrowIfFileIsWrongFormat(allowed);

            string serverPath = Path.Combine(_env.WebRootPath, "images", "cars");
            serverPath.EnsureDirectoryExists();
            
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

            pageSize.THrowIfLessThanAndMoreThan(1,18, "Page size cannot be less than 1 or greater than 18.");

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



        [HttpGet("deleted")]
        public async Task<ActionResult<IEnumerable<Car>>> GetDeletedCars()
        {
            return await _context.Cars
            .IgnoreQueryFilters()
            .Where(c => c.IsDeleted)
            .ToListAsync();
        }
    }
}