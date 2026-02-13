using Autovibe.API.Data;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Runtime.CompilerServices;
using Microsoft.Extensions.Options;


namespace Autovibe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetMe()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == null)
                {
                    return Unauthorized("User not found.");
                }
                if (!int.TryParse(userId, out int userIdInt))
                {
                    return Unauthorized("Invalid user id.");
                }
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == userIdInt);

                if (user == null)
                {
                    Console.WriteLine("User not found.");
                    return NotFound();
                }

                var result = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    CreatedAt = user.CreatedAt ?? DateTime.Now,
                    UpdatedAt = user.UpdatedAt ?? DateTime.Now
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "An error occurred while retrieving the user.");
            }
        }

        //PUT: api/user/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> UpdateUser(int id, [FromBody] UserUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            if (userId != user.Id)
            {
                return Unauthorized("You are not allowed to update this user.");
            }

            user.FirstName = updateDto.FirstName;
            user.LastName = updateDto.LastName;
            user.PhoneNumber = updateDto.PhoneNumber;

            user.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            var updatedUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == user.Id);

            if (updatedUser == null)
            {
                return BadRequest("User could not be updated.");
            }

            var result = new UserDto
            {
                Id = updatedUser.Id,
                Email = updatedUser.Email,
                FirstName = updatedUser.FirstName,
                LastName = updatedUser.LastName,
                PhoneNumber = updatedUser.PhoneNumber,
                CreatedAt = updatedUser.CreatedAt ?? DateTime.Now,
                UpdatedAt = updatedUser.UpdatedAt ?? DateTime.Now
            };

            return Ok(result);

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }
            int UserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (UserId != user.Id)
            {
                return Unauthorized("You are not allowed to delete this user.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }


}