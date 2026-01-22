using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Autovibe.API.Models;

public class Car
{
    public int Id {get; set; }

    [Required]
    public string Make {get; set; }
    [Required]
    public string Model {get; set; }
    [Required]
    public int Year {get; set; }
    [Required]
    public decimal Price {get; set; }
    
    public int FuelType {get; set; }
    public string Transmission {get; set; }
    public string Color {get; set; }
    public string Description {get; set; }
    public int UserId {get; set; }
    public User User {get; set; }
    public DateTime CreatedAt {get; set; }
    public DateTime UpdatedAt {get; set; }

}