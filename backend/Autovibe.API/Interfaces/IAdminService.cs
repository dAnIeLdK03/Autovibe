using Autovibe.API.DTOs.Users;
using Autovibe.API.Models;

namespace Autovibe.API.Interfaces;

public interface IAdminService
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
}