using System.ComponentModel.DataAnnotations;

namespace Autovibe.API.DTOs.Users;

public class UserUpdateDto {
    public string? FirstName {get; set; }
    public string? LastName {get; set; }
    public string? PhoneNumber {get; set; }
}