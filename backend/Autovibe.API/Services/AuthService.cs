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
        private readonly JwtSettings _jwtSettings;

        public AuthService(
            AppDbContext context,
            IOptions<JwtSettings> jwtOptions)
        {
            _context = context;
            _jwtSettings = jwtOptions.Value;
        }

        public async Task<UserDto> Enroll(UserRegisterDto registerDto)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Email == registerDto.Email);

            userExists.ThrowIfTrue("User with this email already exists.");

            if (registerDto.Password != registerDto.ConfirmPassword)
            {
                throw new BadRequestException("Passwords do not match.");
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
                Role = Role.User
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
                UpdatedAt = user.UpdatedAt ?? DateTime.Now,
                Role = user.Role,
                IsBlocked = user.IsBlocked,
                BlockedUntil = user.BlockedUntil,
                BlockReason = user.BlockReason
            };
        }

        public async Task<AuthResponseDto> Sign(UserLoginDto loginDto)
        {

            var user = await _context.Users
                   .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            user.ThrowIfNull("User was not found");
            var now = DateTime.UtcNow;
            var isBlocked =
                user.IsBlocked ||
                (user.BlockedUntil.HasValue && user.BlockedUntil.Value > now);

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                throw new UnauthorizedException("Invalid email or password.");
            }
            if (isBlocked)
            {
                var message = string.IsNullOrWhiteSpace(user.BlockReason)
                    ? "Your account has been blocked. Please contact support."
                    : $"Your account has been blocked, Reason: {user.BlockReason.Trim()}";

                if (user.BlockedUntil.HasValue && user.BlockedUntil.Value > now)
                {
                    message += $" Blocked until {user.BlockedUntil.Value:u} UTC.";
                }

                user.ThrowIfForbidden(true, message);
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
                    UpdatedAt = user.UpdatedAt ?? DateTime.Now,
                    Role = user.Role,
                    IsBlocked = user.IsBlocked,
                    BlockedUntil = user.BlockedUntil,
                    BlockReason = user.BlockReason
                }
            };
        }

        private string GenerateJwtToken(User user)
        {
            if (string.IsNullOrWhiteSpace(_jwtSettings.Key))
                throw new InvalidOperationException("JWT Key is missing in configuration.");

            if (string.IsNullOrWhiteSpace(_jwtSettings.Issuer))
                throw new InvalidOperationException("JWT Issuer is missing in configuration.");

            if (string.IsNullOrWhiteSpace(_jwtSettings.Audience))
                throw new InvalidOperationException("JWT Audience is missing in configuration.");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}