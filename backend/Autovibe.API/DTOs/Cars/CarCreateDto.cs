using System.ComponentModel.DataAnnotations;

namespace Autovibe.API.DTOs.Cars;

public class CarCreateDto
{
    [Required]
    public string Make {get; set; } = string.Empty;

    [Required]
    public string Model {get; set; } = string.Empty;

    [Required]
    [Range(1900, 2100)]
    public int Year {get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price {get; set; }

    [Range(0, int.MaxValue)]
    public int Mileage {get; set; }

    public string FuelType {get; set; } = string.Empty;
    public string Transmission {get; set; } = string.Empty;
    public string Color {get; set; } = string.Empty;

    public string Decription {get; set; } = string.Empty;

    public int UserId {get; set; }
}