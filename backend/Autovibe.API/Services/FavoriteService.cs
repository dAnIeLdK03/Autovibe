
using Autovibe.API.Data;
using Autovibe.API.DTOs.Cars;
using Autovibe.API.Exceptions;
using Autovibe.API.Interfaces;
using Autovibe.API.Models;
using Microsoft.EntityFrameworkCore;
using Autovibe.API.Services.Helpers;

namespace Autovibe.API.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly AppDbContext _context;

        public FavoriteService(
            AppDbContext context
        )
        {
            _context = context;
        }

        public async Task AddAsync(int userId, int carId)
        {
            var carExists = await _context.Cars.AnyAsync(c => c.Id == carId);
            if (!carExists)
            {
                throw new NotFoundException("Car cannot be found");
            }

            var already = await _context.Favorites.AnyAsync(f => f.UserId == userId && f.CarId == carId);
            if (already)
                return;

            _context.Favorites.Add(new Favorite
            {
                UserId = userId,
                CarId = carId,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(int userId, int carId)
        {
            var row = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.CarId == carId);

            if (row is null)
                return;

            _context.Favorites.Remove(row);
            await _context.SaveChangesAsync();

        }

        public async Task<PageResponse<CarListDto>> GetPageAsync(int userId, int pageNumber, int pageSize)
        {
            pageNumber.ThrowIfLessThan(1, "Page number cannot be less than 1.");
            pageSize.THrowIfLessThanAndMoreThan(1, 18, "Page size cannot be less than 1 or greater than 18.");
            var favoritesQuery = _context.Favorites
                .AsNoTracking()
                .Where(f => f.UserId == userId);
            var totalCount = await favoritesQuery.CountAsync();
            var items = await favoritesQuery
                .OrderByDescending(f => f.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Join(
                    _context.Cars.AsNoTracking(),
                    f => f.CarId,
                    c => c.Id,
                    (f, c) => c)
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

        public async Task<bool> IsFavorite(int userId, int carId)
        {
            return await _context.Favorites.AnyAsync(f => f.UserId == userId && f.CarId == carId);
        }

    }
}