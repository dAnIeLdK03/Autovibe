using System.ComponentModel.DataAnnotations;

namespace Autovibe.API.DTOs.Cars;

public class CarCreateDto
{
    [Required]
    public string Make {get; set; } = string.Empty;

    [Required]
    public string Model {get; set; } = string.Empty;

    [Required(ErrorMessage = "Year is required")]
    [PastOrPresentDate(ErrorMessage = "Year cannot be in the future")]
    public int Year {get; set; } 

    [Required]
    [Range(0, double.MaxValue, ErrorMessage = "Price must be a positive number" )]
    public decimal Price {get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Mileage must be a positive number")]
    public int Mileage {get; set; }

    public string FuelType {get; set; } = string.Empty;
    public string Transmission {get; set; } = string.Empty;
    public string Color {get; set; } = string.Empty;

    public string Description {get; set; } = string.Empty;


    public List<string> ImageUrls {get; set; } = new List<string>();
}