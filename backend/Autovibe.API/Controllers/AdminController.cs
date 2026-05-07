using Autovibe.API.Data;
using Autovibe.API.DTOs.Cars;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Extensions;
using Autovibe.API.Interfaces;
using Autovibe.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Autovibe.API.Controllers
{
    [Authorize(Policy = "AdminOnly")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly AppDbContext _context;


        public AdminController(IAdminService adminService, AppDbContext context)
        {
            _adminService = adminService;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<PageResponse<UserDto>>> GetUsers([FromQuery] AdminUserFilterDto request)
        {
            var result = await _adminService.GetAllUsersAsync(request);
            return Ok(result);
        }


        [HttpGet("deleted")]
        public async Task<ActionResult<IEnumerable<Car>>> GetDeletedCars()
        {
            return await _context.Cars
            .IgnoreQueryFilters()
            .Where(c => c.IsDeleted)
            .ToListAsync();
        }

        [HttpPatch("{id}/role")]
        public async Task<ActionResult> UpdateUserRole(int id, [FromBody] AdminUpdateUserRoleDto dto)
        {
            var adminId = User.GetUserId();

            adminId.ThrowIfNull("Log in first");

            id.ThrowIfLessThan(0, "Invalid car id.");

            await _adminService.UpdateUserRoleAsync(id, dto.Role, adminId!.Value);

                return Ok(new
                {
                    Id = id,
                    NewRole = dto.Role.ToString(),
                    Message = "User role updated successfully"
                });
        }

        [HttpPatch("{userId}/status")]
        public async Task<ActionResult> UpdateUserStatus(int userId, [FromBody] AdminUpdateStatusDto dto)
        {
            if((dto.IsBlocked == true || dto.BlockedUntil != null) && string.IsNullOrWhiteSpace(dto.BlockReason))
            {
                throw new BadRequestException("A reason must be provided when blocking a user.");
            }

            await _adminService.UpdateUserStatusAsync(userId, dto);

            return Ok(new
            {
                Message = "User updated successfully",
                UserId = userId,
                IsBlocked = dto.IsBlocked ?? true
            });
        }
    }
}