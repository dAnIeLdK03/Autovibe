using Autovibe.API.Data;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Runtime.CompilerServices;
using Autovibe.API.Interfaces;
using Autovibe.API.Exceptions;
using Autovibe.API.Extensions;
using Microsoft.AspNetCore.RateLimiting;


namespace Autovibe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetMe()
        {
            
                var userId = User.GetUserId();

                userId.ThrowIfNull("User can't be found.");
            
                var result = await _userService.GetUserAsync(userId.Value);

                result.ThrowIfNull("User cannot be found");

                return Ok(result);
           
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUserById(int id)
        {
            var result = await _userService.GetUserAsync(id);
            return Ok(result);
        }

        //PUT: api/user/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> UpdateUser(int id, [FromBody] UserUpdateDto updateDto)
        {
            var userId = User.GetUserId();

                userId.ThrowIfDoesNotMatchAndIsNull(id, "User can't be found");

            var result = await _userService.UpdateUserAsync(id, updateDto);

                result.ThrowIfNull("User cannot be found");

            return Ok(result);

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var userId = User.GetUserId();

                userId.ThrowIfDoesNotMatchAndIsNull(id, "You are not allowed to delete this user.");
                
                id.ThrowIfNull("Invalid user id.");

            await _userService.DeleteUserAsync(id);
            return NoContent();
        }

        [HttpPut("change-password")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userId = User.GetUserId();
            
                userId.ThrowIfNull("User can't be found.");

            await _userService.ChangePasswordAsync(userId.Value, dto);
            return NoContent();
        }
    }

}