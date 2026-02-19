using Autovibe.API.Data;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Runtime.CompilerServices;
using Microsoft.Extensions.Options;
using Autovibe.API.Interfaces;
using Autovibe.API.Exceptions;


namespace Autovibe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetMe()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == null)
                {
                    throw new NotFoundException("User can't be found.");
                }
                if (!int.TryParse(userId, out int userIdInt))
                {
                    throw new BadRequestException("User id is not a number.");
                }
                var result = await _userService.GetUserAsync(userIdInt);
                if (result == null)
                {
                    return NotFound();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving the user.");
                return StatusCode(500, "An error occurred while retrieving the user.");
            }
        }

        //PUT: api/user/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> UpdateUser(int id, [FromBody] UserUpdateDto updateDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            if (userId != id)
            {
                throw new UnauthorizedException("You are not allowed to update this user.");
            }

            var result = await _userService.UpdateUserAsync(id, updateDto);
            if (result == null)
            {
                throw new NotFoundException("User not found.");
            }


            return Ok(result);

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            int UserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _userService.DeleteUserAsync(id);
            return NoContent();
        }
    }


}