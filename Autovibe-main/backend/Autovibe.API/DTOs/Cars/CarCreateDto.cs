using System.ComponentModel.DataAnnotations;

namespace Autovibe.API.DTOs.Cars;

public class CarCreateDto
{
    [Required]
    public string Make {get; set; } = string.Empty;

    [Required]
    public string Model {get; set; } = string.Empty;

    [Required]
    [Range(1900, 2030, ErrorMessage = "The year must be between 1900 and current year.")]
    public int Year {get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
    public decimal Price {get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Mileage must be a positive number.")]
    public int Mileage {get; set; }

    public string FuelType {get; set; } = string.Empty;
    public string Transmission {get; set; } = string.Empty;
    public string Color {get; set; } = string.Empty;

    [MinLength(10, ErrorMessage = "Description must be at least 10 characters long.")]
    public string Description {get; set; } = string.Empty;

    public int UserId {get; set; }

    public List<string> ImageUrls {get; set; } = new List<string>();
}