using Autovibe.API.Exceptions;
using Autovibe.API.DTOs.Cars;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Extensions;
using Autovibe.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Autovibe.API.Constants;

namespace Autovibe.API.Controllers
{
    [Authorize(Roles = AppRoles.Admin)]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ICarService _carService;


        public AdminController(IAdminService adminService, ICarService carService)
        {
            _adminService = adminService;
            _carService = carService;
        }

        [HttpGet]
        public async Task<ActionResult<PageResponse<UserDto>>> GetUsers([FromQuery] AdminUserFilterDto request)
        {
            var result = await _adminService.GetAllUsersAsync(request);
            return Ok(result);
        }


        [HttpGet("deleted")]
        public async Task<ActionResult<PageResponse<CarListDto>>> GetDeletedCars([FromQuery]DeletedCarsDto request)
        {
            var result = await _adminService.GetDeletedCarsAsync(request);
                result.ThrowIfNull("Unable to load cars.");
            return Ok(result);

        }

        [HttpPatch("{id}/role")]
        public async Task<ActionResult> UpdateUserRole(int id, [FromBody] AdminUpdateUserRoleDto dto)
        {
            var adminId = User.GetUserId();

            adminId.ThrowIfNull("Log in first");

            id.ThrowIfLessThan(1, "Invalid user id.");

            await _adminService.UpdateUserRoleAsync(id, dto.Role, adminId!.Value);

            return Ok(new
            {
                Id = id,
                NewRole = dto.Role.ToString(),
                Message = "User role updated successfully"
            });
        }

        [HttpPatch("{userId}/status")]
        public async Task<ActionResult<UserDto>> UpdateUserStatus(int userId, [FromBody] AdminUpdateStatusDto dto)
        {
            var adminId = User.GetUserId();
            adminId.ThrowIfNull("Log in first");
            
            userId.ThrowIfLessThan(1, "Invalid user id");

            if ((dto.IsBlocked == true || dto.BlockedUntil != null) && string.IsNullOrWhiteSpace(dto.BlockReason))
            {
                throw new BadRequestException("A reason must be provided when blocking a user.");
            }

            var result = await _adminService.UpdateUserStatusAsync(userId, dto, adminId!.Value);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> HardDeleteCar(int id)
        {
            id.ThrowIfLessThan(1, "Invalid car id");
            
            await _adminService.HardDeleteCarAsync(id);
            return NoContent();
        }

        [HttpPatch("{id}/restore")]
        public async Task<ActionResult> RestoreCar(int id)
        {
            id.ThrowIfLessThan(1, "Invalid car id");

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
            id.ThrowIfLessThan(1, "Invalid user id");

            var result = await _adminService.AdminGetUserAsync(id);
            return Ok(result);
        }

        [HttpGet("{id}/deleted")]
        public async Task<ActionResult<CarDetailsDto>> GetDeletedCarsDetails(int id)
        {
            id.ThrowIfLessThan(1, "Invalid car id.");

            var result = await _adminService.GetDeletedCarsDetailsAsync(id);
            
            result.ThrowIfNull("Car cannot be found");

            return Ok(result);

        }


    }
}