using Autovibe.API.Data;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Exceptions;
using Microsoft.EntityFrameworkCore;
using Autovibe.API.Interfaces;
using Autovibe.API.Services.Helpers;



namespace Autovibe.API.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(
            AppDbContext context
        )
        {
            _context = context;
        }

        public async Task<UserDto> GetUserAsync(int id)
        {

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            user.ThrowIfNull("User not found");
            user.Id.ThrowIfInvalidId("id for user not found");

            return user.UserListDto();
        }

        public async Task<UserDto> UpdateUserAsync(int id, UserUpdateDto updateDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            user.ThrowIfNull("User not found");
            user.Id.ThrowIfInvalidId("id for user not found");

            user.FirstName = updateDto.FirstName;
            user.LastName = updateDto.LastName;
            user.PhoneNumber = updateDto.PhoneNumber;

            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var updatedUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == user.Id);

            updatedUser!.Id.ThrowIfInvalidId("User not found after update.");

            return user.UserListDto();
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            user!.Id.ThrowIfInvalidId("User not found");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task ChangePasswordAsync(int id, ChangePasswordDto changePasswordDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            user!.Id.ThrowIfInvalidId("User not found");

            if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.PasswordHash))
            {
                throw new BadRequestException("Invalid password.");
            }


            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

}