using Autovibe.API.Exceptions;
using Autovibe.API.Data;
using Autovibe.API.DTOs.Cars;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Extensions;
using Autovibe.API.Interfaces;
using Autovibe.API.Models;
using Autovibe.API.Services.Helpers;
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
        private readonly ICarService _carService;


        public AdminController(IAdminService adminService, AppDbContext context, ICarService carService)
        {
            _adminService = adminService;
            _context = context;
            _carService = carService;
        }

        [HttpGet]
        public async Task<ActionResult<PageResponse<UserDto>>> GetUsers([FromQuery] AdminUserFilterDto request)
        {
            var result = await _adminService.GetAllUsersAsync(request);
            return Ok(result);
        }


        [HttpGet("deleted")]
  public async Task<ActionResult<IEnumerable<CarListDto>>> GetDeletedCars(){
            var cars = await _context.Cars
          .AsNoTracking()
          .IgnoreQueryFilters()
          .Where(c => c.IsDeleted)
          .OrderByDescending(c => c.DeletedAt ?? c.UpdatedAt)
          .ToListAsync();
            return Ok(cars.Select(c => c.ListDto()));

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
            if ((dto.IsBlocked == true || dto.BlockedUntil != null) && string.IsNullOrWhiteSpace(dto.BlockReason))
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

        [HttpDelete("{id}")]
        public async Task<ActionResult> HardDeleteCar(int id)
        {
            id.ThrowIfNull("Invalid user id.");

            await _adminService.HardDeleteCarAsync(id);
            return NoContent();
        }

        [HttpPatch("{id}/restore")]
        public async Task<ActionResult> RestoreCar(int id)
        {
            id.ThrowIfNull("Log in first.");

            var result = await _adminService.RestoreCarAsync(id);

            result.ThrowIfNull("Car cannot be found");

            return Ok(result);
        }

        [HttpGet("{userId}/cars")]
        public async Task<ActionResult<PageResponse<CarListDto>>> GetUserCars(
            int userId,
            int pageNumber = 1,
            int pageSize = 9)
        {
            userId.ThrowIfLessThan(1, "Invalid user id.");

            var result = await _carService.GetUserCarsAsync(userId, pageNumber, pageSize);
            return Ok(result);
        }

         [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUserById(int id)
        {
            var result = await _adminService.AdminGetUserAsync(id);
            return Ok(result);
        }

    }
}