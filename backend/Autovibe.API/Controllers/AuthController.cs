using Microsoft.AspNetCore.Mvc;
using Autovibe.API.DTOs.Users;
using Microsoft.AspNetCore.Authorization;
using Autovibe.API.Interfaces;
using Microsoft.AspNetCore.RateLimiting;




namespace Autovibe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        [EnableRateLimiting("auth")]
        public async Task<ActionResult<UserDto>> Register([FromBody] UserRegisterDto registerDto)
        {
            var result = await _authService.Enroll(registerDto);
               result.ThrowIfNull("Registration failure.");

                return CreatedAtAction("GetUserById", "User", new { id = result.Id }, result);

            
        }

        [AllowAnonymous]
        [HttpPost("login")]
        [EnableRateLimiting("auth")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] UserLoginDto loginDto)
        {

                var result = await _authService.Sign(loginDto);
                if (result == null)
                    
                    result.ThrowIfNull("Login failure.");

                return Ok(result);
        }

    }
}