using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Autovibe.API.Data;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Models;
using BCrypt.Net;


namespace Autovibe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] UserRegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userExists = await _context.Users.AnyAsync(u => u.Email == registerDto.Email);
                if (userExists)
                {
                    return BadRequest("User already exists.");
                }

                if (registerDto.Password != registerDto.ConfirmPassword)
                {
                    return BadRequest("Password do not match.");
                }

                string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

                var user = new User
                {
                    Email = registerDto.Email,
                    PasswordHash = passwordHash,
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    PhoneNumber = registerDto.PhoneNumber,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = null
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

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

                return CreatedAtAction(nameof(Register), new { id = result.Id }, result);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "An error occurred while registering the user.");
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] UserLoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

                if (user == null)
                {
                    return Unauthorized("User does not exist.");
                }

                if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                {
                    return Unauthorized("Invalid password.");
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
                return StatusCode(500, "An error occurred while logging in the user.");
            }
        }

    }
}