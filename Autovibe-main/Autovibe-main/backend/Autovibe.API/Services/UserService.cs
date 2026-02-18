using Autovibe.API.Data;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Exceptions;
using Autovibe.API.Models;
using Microsoft.EntityFrameworkCore;
using Autovibe.API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using System.Reflection.Metadata;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;
using System.Security.Claims;
 

namespace Autovibe.API.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UserService> _logger;

        public UserService(
            AppDbContext context,
            ILogger<UserService> logger
        )
        {
         _context = context;
         _logger = logger; 
        }

        public async Task<UserDto> GetUserAsync(int id)
        {
            
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    throw new NotFoundException("User not found.");
                }
                return new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    CreatedAt = user.CreatedAt ?? DateTime.Now,
                    UpdatedAt = user.UpdatedAt ?? DateTime.Now
                };
        }

        public async Task<UserDto>UpdateUserAsync(int id, UserUpdateDto updateDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

            

            user.FirstName = updateDto.FirstName;
            user.LastName = updateDto.LastName;
            user.PhoneNumber = updateDto.PhoneNumber;

            user.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            var updatedUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == user.Id);

            if (updatedUser == null)
            {
                throw new Exception("User not found after update.");
            }
            return new UserDto
            {
                Id = updatedUser.Id,
                Email = updatedUser.Email,
                FirstName = updatedUser.FirstName,
                LastName = updatedUser.LastName,
                PhoneNumber = updatedUser.PhoneNumber,
                CreatedAt = updatedUser.CreatedAt ?? DateTime.Now,
                UpdatedAt = updatedUser.UpdatedAt ?? DateTime.Now
            };
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

             _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }

}