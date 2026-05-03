using Autovibe.API.DTOs.Cars;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Models;

namespace Autovibe.API.Interfaces;

public interface IAdminService
{
    Task<PageResponse<UserDto>> GetAllUsersAsync(AdminUserFilterDto request);
    Task UpdateUserRoleAsync(int targetUserId, Role newRole, int actingAdminId);
}