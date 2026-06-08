using Autovibe.API.Data;
using Autovibe.API.DTOs.Cars;
using Autovibe.API.Models;
using Microsoft.EntityFrameworkCore;
using Autovibe.API.Interfaces;
using Autovibe.API.Services.Helpers;
using Autovibe.API.Constants;



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
        public async Task<CarDetailsDto?> UpdateAsync(int id, CarUpdateDto request)
        {
            var car = await _context.Cars
                .Include(c => c.ImageUrls)
                .FirstOrDefaultAsync(c => c.Id == id);

            car!.Id.ThrowIfInvalidId($"Car with id {id} was not found");



            request.ApplyTo(car);
            await _context.SaveChangesAsync();
            await _context.Entry(car).Reference(c => c.User).LoadAsync();


            return car.DetailsDto();
        }

        public async Task<CarDetailsDto?> CreateAsync(CarUpdateDto request, int userId)
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

            request.PageSize.ThrowIfLessThanAndMoreThan(
                PaginationConstants.MinPageSize,
                PaginationConstants.MaxPageSize,
                $"Page size cannot be less than {PaginationConstants.MinPageSize} or greater than {PaginationConstants.MaxPageSize}.");


            var query = _context.Cars
            .AsQueryable()
            .AsNoTracking();

            query = query.ApplyFilters(request)
                         .ApplySorting(request.SortType);

            var totalItems = await query.CountAsync();

            var items = await query
                .AsNoTracking()
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(c => c.ListDto())
                .ToListAsync();


            return new PageResponse<CarListDto>
            (
                items, totalItems, request.PageSize, request.PageNumber
            );
        }

        public async Task<bool> DeleteAsync(int id, int userId, bool isAdmin)
        {
            var car = await _context.Cars.FirstOrDefaultAsync(c => c.Id == id);
            car!.Id.ThrowIfInvalidId($"Car with id {id} was not found");

            car.ThrowIfForbidden(car.UserId != userId && !isAdmin, "You do not have permission do delete this car");

            car.IsDeleted = true;
            car.DeletedAt = DateTime.UtcNow;

            var favorites = await _context.Favorites
                .Where(f => f.CarId == car.Id && !f.IsDeleted)
                .ToListAsync();

            foreach (var fav in favorites)
            {
                fav.IsDeleted = true;
            }

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

            file.ThrowIfImageIsInvalid();

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

            pageSize.ThrowIfLessThanAndMoreThan(
            PaginationConstants.MinPageSize,
            PaginationConstants.MaxPageSize,
            $"Page size cannot be less than {PaginationConstants.MinPageSize} or greater than {PaginationConstants.MaxPageSize}.");

            var query = _context.Cars
            .AsNoTracking()
            .Where(c => c.UserId == userId);

            var totalItems = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(c => c.ListDto())
                .ToListAsync();

            return new PageResponse<CarListDto>
            (
                items, totalItems, pageSize, pageNumber
            );
        }

    }
}
