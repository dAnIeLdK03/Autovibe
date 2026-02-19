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
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _logger = logger;
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] UserRegisterDto registerDto)
        {
            try
            {
                var result = await _authService.Enroll(registerDto);
                if (result == null)
                {
                   throw new ConflictException("User already exists");
                }


                return CreatedAtAction(nameof(Register), new { id = result.Id }, result);

            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] UserLoginDto loginDto)
        {
            try
            {

                var response = await _authService.Sign(loginDto);
                if (response == null)
                {
                    throw new NotFoundException("User not found");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                throw new BadRequestException(ex.Message);
            }
        }

    }
}