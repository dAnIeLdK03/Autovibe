using Autovibe.API.Data;
using Autovibe.API.DTOs.Cars;
using Autovibe.API.Models;
using Microsoft.EntityFrameworkCore;
using Autovibe.API.Interfaces;
using Autovibe.API.Services.Helpers;
using Autovibe.API.Constants;
using Autovibe.API.Exceptions;
using Autovibe.API.Extensions;



namespace Autovibe.API.Services
{

    public class CarService : ICarService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CarService(
            AppDbContext context,
            IWebHostEnvironment env,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _context = context;
            _env = env;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<CarDetailsDto?> UpdateAsync(int id, CarUpdateDto request)
        {
            var user = _httpContextAccessor.HttpContext?.User;
            var userId = user?.GetUserId();
            userId.ThrowIfNull("Log in first");

            var isAdmin = user?.IsInRole(AppRoles.Admin) ?? false;

            var car = await _context.Cars
                .Include(c => c.ImageUrls)
                .FirstOrDefaultAsync(c => c.Id == id);

            car!.Id.ThrowIfInvalidId($"Car with id {id} was not found");
            
            bool isOwner = car.UserId == userId;
            if (!isAdmin && !isOwner)
            {
                throw new ForbiddenException("You are not allowed to update this car.");
            }

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
            PaginationHelper.Validate(request.PageNumber, request.PageSize);

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

            return PaginationHelper.BuildResponse<CarListDto>(items, totalItems, request.PageNumber, request.PageSize);
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

        public async Task<PageResponse<CarListDto>> GetUserCarsAsync(int userId, int pageNumber, int pageSize)
        {
            PaginationHelper.Validate(pageNumber, pageSize);

            var query = _context.Cars
            .AsNoTracking()
            .Where(c => c.UserId == userId);

            var totalItems = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(c => c.ListDto())
                .ToListAsync();

            return PaginationHelper.BuildResponse<CarListDto>(items, totalItems, pageNumber, pageSize);
        }

    }
}
