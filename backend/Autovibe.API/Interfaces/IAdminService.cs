using Autovibe.API.DTOs.Cars;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Models;

namespace Autovibe.API.Interfaces;

public interface IAdminService
{
    Task<PageResponse<UserDto>> GetAllUsersAsync(AdminUserFilterDto request);
    Task UpdateUserRoleAsync(int targetUserId, Role newRole, int actingAdminId);
    Task UpdateUserStatusAsync(int userId, AdminUpdateStatusDto dto);
    Task HardDeleteCarAsync(int id);
    Task<bool> RestoreCarAsync(int id);
    Task<UserDto> AdminGetUserAsync(int id);
    Task<PageResponse<CarListDto>> GetDeletedCarsAsync(DeletedCarsDto request);
    Task<CarDetailsDto?>GetDeletedCarsDetailsAsync(int id);
}