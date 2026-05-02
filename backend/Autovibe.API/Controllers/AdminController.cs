using Autovibe.API.DTOs.Users;
using Autovibe.API.Extensions;
using Autovibe.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Autovibe.API.Controllers
{
    [Authorize(Policy = "AdminOnly")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var result = await _adminService.GetAllUsersAsync();
            result.ThrowIfNull("Unable to load users.");
            return Ok(result);
        }
    }
}