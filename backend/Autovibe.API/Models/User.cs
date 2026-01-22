using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Autovibe.API.Models;

public class User
{
    public int Id {get; set; }

    [Required]
    public string Email {get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string PasswordHash {get; set; } = string.Empty;
    
    public string? FirstName {get; set; }
    public string? LastName {get; set; }
    public string? PhoneNumber {get; set; }
    public DateTime? CreatedAt {get; set; }
    public DateTime? UpdatedAt {get; set; }

    public List<Car> Cars {get; set; } = new List<Car>(); //navigation property, not a column in the database.
}