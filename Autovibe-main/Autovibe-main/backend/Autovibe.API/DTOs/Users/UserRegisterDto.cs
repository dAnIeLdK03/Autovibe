using System.ComponentModel.DataAnnotations;

namespace Autovibe.API.DTOs.Users;

public class UserRegisterDto
{
    public string Email {get; set; } = string.Empty;

    public string Password {get; set; } = string.Empty;

    public string ConfirmPassword {get; set; } = string.Empty;

    public string? FirstName {get; set; }
    public string? LastName {get; set; }
    public string? PhoneNumber {get; set; }


}