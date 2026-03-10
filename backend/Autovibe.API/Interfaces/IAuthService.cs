using Autovibe.API.DTOs.Users;

namespace Autovibe.API.Interfaces;

public interface IAuthService
{
    Task<UserDto>Enroll( UserRegisterDto registerDto);

    Task<AuthResponseDto>Sign( UserLoginDto loginDto);
}