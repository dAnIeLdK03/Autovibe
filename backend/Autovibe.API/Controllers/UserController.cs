using Autovibe.API.Data;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Autovibe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{me}")]
        public async Task<ActionResult<UserDto>> GetMe(int me)
        {
            try
            {
                var query = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == me);

                if (query == null)
                {
                    Console.WriteLine("User not found.");
                    return NotFound();
                }

                var result = new UserDto
                {
                    Id = query.Id,
                    Email = query.Email,
                    FirstName = query.FirstName,
                    LastName = query.LastName,
                    PhoneNumber = query.PhoneNumber,
                    CreatedAt = query.CreatedAt ?? DateTime.Now,
                    UpdatedAt = query.UpdatedAt ?? DateTime.Now
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "An error occurred while retrieving the user.");
            }
        }
    }
}