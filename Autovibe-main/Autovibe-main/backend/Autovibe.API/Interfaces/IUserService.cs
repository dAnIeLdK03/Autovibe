using Autovibe.API.DTOs.Users;

namespace Autovibe.API.Interfaces;

public interface IUserService
{
    Task<UserDto>GetUserAsync(int id);
    Task<UserDto>UpdateUserAsync(int id, UserUpdateDto updateDto);
    Task DeleteUserAsync(int id);
}