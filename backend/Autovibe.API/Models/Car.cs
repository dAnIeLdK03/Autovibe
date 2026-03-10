using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Autovibe.API.Models;

public class Car
{
    public int Id {get; set; }

    [Required]
    public string Make {get; set; } = string.Empty;
    [Required]
    public string Model {get; set; } = string.Empty;
    [Required]
    public int Year {get; set; }
    [Required]
    public decimal Price {get; set; }


    public int Mileage {get; set; }
    public string FuelType {get; set; } = string.Empty;
    public string Transmission {get; set; } = string.Empty;
    public string Color {get; set; } = string.Empty;
    public string Description {get; set; } = string.Empty;
    public int UserId {get; set; }
    public User User {get; set; } = null!; 
    public DateTime? CreatedAt {get; set; }
    public DateTime? UpdatedAt {get; set; }

    public List<string> ImageUrls {get; set; } = new List<string>();
 
}
