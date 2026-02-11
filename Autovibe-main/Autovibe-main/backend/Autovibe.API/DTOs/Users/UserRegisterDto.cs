using System.ComponentModel.DataAnnotations;

namespace Autovibe.API.DTOs.Users;

public class UserRegisterDto
{
    [Required]
    [EmailAddress]
    public string Email {get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password {get; set; } = string.Empty;

    [Required]
    [Compare("Password", ErrorMessage = "Password do not match.")]
    public string ConfirmPassword {get; set; } = string.Empty;

    public string? FirstName {get; set; }
    public string? LastName {get; set; }
    public string? PhoneNumber {get; set; }


}