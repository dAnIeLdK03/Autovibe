using Autovibe.API.Data;
using Autovibe.API.DTOs.Users;
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
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var result = await _adminService.GetAllUsersAsync();
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
    }
}