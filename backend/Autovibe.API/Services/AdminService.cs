
using Microsoft.EntityFrameworkCore;
using Autovibe.API.Data;
using Autovibe.API.DTOs.Cars;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Interfaces;
using Autovibe.API.Models;

namespace Autovibe.API.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context){
            _context = context;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    PhoneNumber = u.PhoneNumber,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt,
                    Role = u.Role
                })
                .ToListAsync();
        }
      
    }
}