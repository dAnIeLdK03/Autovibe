using Microsoft.EntityFrameworkCore;
using Autovibe.API.Data;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Interfaces;

namespace Autovibe.API.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            // Materialize entities first, then map — avoids some EF/Pomelo translation issues
            // with ValueConversion on Role inside complex projections.
            var users = await _context.Users
                .AsNoTracking()
                .OrderBy(u => u.Id)
                .ToListAsync();

            return users.Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                PhoneNumber = u.PhoneNumber,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt,
                Role = u.Role
            }).ToList();
        }
    }
}