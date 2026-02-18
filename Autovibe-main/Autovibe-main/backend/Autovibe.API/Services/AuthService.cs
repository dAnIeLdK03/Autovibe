using Autovibe.API.Data;
using Autovibe.API.DTOs.Users;
using Autovibe.API.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Reflection.Metadata;
using System.Security.Claims;
using Autovibe.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Autovibe.API.Models;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using System.Runtime.CompilerServices;
using Microsoft.Extensions.Options;
using Autovibe.API.Services;
using Autovibe.API.Interfaces;
using Microsoft.Extensions.Logging;
using System.Text;

namespace Autovibe.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AuthService> _logger;
        private readonly JwtSettings _jwtSettings;
        
        public AuthService(
            AppDbContext context,
            ILogger<AuthService> logger,
            IOptions<JwtSettings> jwtOptions)
        {
            _context = context;
            _logger = logger;
            _jwtSettings = jwtOptions.Value;
        }

        public async Task<UserDto> Enroll(UserRegisterDto registerDto)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Email == registerDto.Email);
            if (userExists)
            {
                _logger.LogError("User already exists.");
                throw new Exception("User with this email already exists.");
            }

            if (registerDto.Password != registerDto.ConfirmPassword)
            {
                _logger.LogError("Passwords do not match.");
                throw new Exception("Passwords do not match.");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var user = new User
            {
                Email = registerDto.Email,
                PasswordHash = passwordHash,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                PhoneNumber = registerDto.PhoneNumber,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                CreatedAt = user.CreatedAt ?? DateTime.Now,
                UpdatedAt = user.UpdatedAt ?? DateTime.Now
            };
        }

        public async Task<AuthResponseDto> Sign(UserLoginDto loginDto)
        {
            var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                _logger.LogError("User not found.");
                throw new Exception("User not found.");
            }

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                _logger.LogWarning("Invalid password.");
                throw new Exception("Invalid password.");
            }
            
            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    CreatedAt = user.CreatedAt ?? DateTime.Now,
                    UpdatedAt = user.UpdatedAt ?? DateTime.Now
                }
            };
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "Autovibe.API",
                audience: "Autovibe.API",
                claims: claims,
                expires: DateTime.Now.AddMinutes(_jwtSettings.ExpirationInMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}