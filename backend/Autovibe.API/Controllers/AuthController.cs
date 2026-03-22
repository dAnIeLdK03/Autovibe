using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Autovibe.API.Data;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Models;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using System.Runtime.CompilerServices;
using Microsoft.Extensions.Options;
using System.Reflection.Metadata;
using Autovibe.API.Services;
using Autovibe.API.Interfaces;
using Autovibe.API.Exceptions;




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
        public async Task<ActionResult<UserDto>> Register([FromBody] UserRegisterDto registerDto)
        {
            var result = await _authService.Enroll(registerDto);
               result.ThrowIfNull("Registration failure.");

                return CreatedAtAction(nameof(Register), new { id = result.Id }, result);

            
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] UserLoginDto loginDto)
        {

                var result = await _authService.Sign(loginDto);
                if (result == null)
                    
                    result.ThrowIfNull("Login failure.");

                return Ok(result);
        }

    }
}