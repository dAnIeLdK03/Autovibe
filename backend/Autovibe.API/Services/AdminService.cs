using Microsoft.EntityFrameworkCore;
using Autovibe.API.Data;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Interfaces;
using Autovibe.API.Models;
using Autovibe.API.Services.Helpers;
using Autovibe.API.DTOs.Cars;

namespace Autovibe.API.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PageResponse<UserDto>> GetAllUsersAsync(AdminUserFilterDto request)
        {
            request.PageNumber.ThrowIfLessThan(1, "Page number cannot be less than 1.");

            request.PageSize.THrowIfLessThanAndMoreThan(1,18, "Page size cannot be less than 1 or greater than 18.");

            IQueryable<User> query = _context.Users.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                var term = request.Email.Trim();
                query = query.Where(u => u.Email.Contains(term));
            }

            var totalItems = await query.CountAsync();

            var users = await query
                .OrderBy(u => u.Id)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var items = users.Select(u => u.UserListDto()).ToList();


            var totalPages = (int)Math.Ceiling((double)totalItems / request.PageSize);


            return new PageResponse<UserDto>
            {
                Items = items,
                TotalPages = totalPages,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }

    }
}