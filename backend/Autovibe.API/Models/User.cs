using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Autovibe.API.Models;

public class User
{
    public int Id {get; set; }

    [Required]
    public string Email {get; set; }

    [Required]
    [MinLength(6)]
    public string PasswordHash {get; set; }
    
    public string FirstName {get; set; }
    public string LastName {get; set; }
    public string PhoneNumber {get; set; }
    public DateTime CreatedAt {get; set; }
    public DateTime UpdatedAt {get; set; }
}