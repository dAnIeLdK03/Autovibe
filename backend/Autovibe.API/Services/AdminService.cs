using Microsoft.EntityFrameworkCore;
using Autovibe.API.Exceptions;
using Autovibe.API.Data;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Interfaces;
using Autovibe.API.Models;
using Autovibe.API.Services.Helpers;
using Autovibe.API.DTOs.Cars;
using Autovibe.API.Constants;

namespace Autovibe.API.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AdminService(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<PageResponse<UserDto>> GetAllUsersAsync(AdminUserFilterDto request)
        {
            request.PageNumber.ThrowIfLessThan(1, "Page number cannot be less than 1.");

            request.PageSize.ThrowIfLessThanAndMoreThan(
                PaginationConstants.MinPageSize,
                PaginationConstants.MaxPageSize,
                $"Page size cannot be less than {PaginationConstants.MinPageSize} or greater than {PaginationConstants.MaxPageSize}.");

            IQueryable<User> query = _context.Users.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                var term = request.Email.Trim();
                query = query.Where(u => u.Email.Contains(term));
            }

            var totalItems = await query.CountAsync();

            var users = await query
                .AsNoTracking()
                .OrderBy(u => u.Id)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var items = users.Select(u => u.UserListDto()).ToList();



            return new PageResponse<UserDto>
            (
                items, totalItems, request.PageSize, request.PageNumber
            );
        }

        public async Task UpdateUserRoleAsync(int targetUserId, Role newRole, int actingAdminId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == targetUserId);

            user!.Id.ThrowIfInvalidId($"User with id {targetUserId} was not found");

            if (user.Role == Role.Admin && newRole == Role.User)
            {
                var adminCount = await _context.Users.CountAsync(u => u.Role == Role.Admin);
                if (adminCount == 1)
                {
                    throw new BadRequestException("You cannot remove the last administrator in the system.");
                }
            }

            if (targetUserId == actingAdminId)
            {
                throw new BadRequestException("You cannot change your own role");
            }

            user.Role = newRole;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        public async Task UpdateUserStatusAsync(int userId, AdminUpdateStatusDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            user!.Id.ThrowIfInvalidId($"User with id {userId} was not found");

            if (dto.IsBlocked == false)
            {
                user.IsBlocked = false;
                user.BlockedUntil = null;
                user.BlockReason = null;
            }

            else
            {
                if (dto.IsBlocked.HasValue)
                    user.IsBlocked = dto.IsBlocked.Value;

                if (dto.BlockedUntil.HasValue)
                    user.BlockedUntil = dto.BlockedUntil.Value;

                if (!string.IsNullOrWhiteSpace(dto.BlockReason))
                    user.BlockReason = dto.BlockReason.Trim();
            }

            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

        }

        public async Task HardDeleteCarAsync(int id)
        {
            var car = await _context.Cars
                .IgnoreQueryFilters()
                .Where(c => c.IsDeleted && c.Id == id)
                .FirstOrDefaultAsync();

            car!.Id.ThrowIfInvalidId($"Car with id {id} was not found");


            if (car.ImageUrls != null && car.ImageUrls.Any())
            {
                foreach (var imageUrl in car.ImageUrls)
                {
                    if (string.IsNullOrWhiteSpace(imageUrl)) continue;
                    string fileName = Path.GetFileName(imageUrl);
                    string absoluteFilePath = Path.Combine(_env.WebRootPath, "images", "cars", fileName);

                    if (File.Exists(absoluteFilePath))
                    {
                        try
                        {
                            File.Delete(absoluteFilePath);
                        }
                        catch
                        {
                            throw new NotFoundException("There is no images for this car to delete");
                        }
                    }
                }
            }
            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

        }

        public async Task<bool> RestoreCarAsync(int id)
        {
            var car = await _context.Cars
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(c => c.Id == id);

            car!.Id.ThrowIfInvalidId($"Car with id {id} was not found");

            car.IsDeleted = false;
            car.UpdatedAt = DateTime.UtcNow;

            var favoriteToRestore = await _context.Favorites
                .IgnoreQueryFilters()
                .Where(f => f.CarId == car.Id && f.IsDeleted)
                .ToListAsync();

            foreach (var fav in favoriteToRestore)
            {
                fav.IsDeleted = false;
            }

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<UserDto> AdminGetUserAsync(int id)
        {

            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);

            user.ThrowIfNull("User not found");
            user.Id.ThrowIfInvalidId("User not found");

            return user.UserListDto();
        }

        public async Task<PageResponse<CarListDto>> GetDeletedCarsAsync(DeletedCarsDto request)
        {
            request.PageNumber.ThrowIfLessThan(1, "Page number cannot be less than 1.");

            request.PageSize.ThrowIfLessThanAndMoreThan(
                PaginationConstants.MinPageSize,
                PaginationConstants.MaxPageSize,
                $"Page size cannot be less than {PaginationConstants.MinPageSize} or greater than {PaginationConstants.MaxPageSize}.");

            var query = _context.Cars
                .AsNoTracking()
                .IgnoreQueryFilters()
                .Where(c => c.IsDeleted)
                .OrderByDescending(c => c.DeletedAt ?? c.UpdatedAt);

            var totalItems = await query.CountAsync();

            var cars = await query
                .AsNoTracking()
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(c => c.ListDto())
                .ToListAsync();

            return new PageResponse<CarListDto>
            (
                cars, totalItems, request.PageSize, request.PageNumber
            );
        }

        public async Task<CarDetailsDto?> GetDeletedCarsDetailsAsync(int id)
        {
            var car = await _context.Cars
                .AsNoTracking()
                .IgnoreQueryFilters()
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id && c.IsDeleted);

            return car.ThrowIfNull($"Car with id {id} was not found")!.DetailsDto();

        }

    }
}