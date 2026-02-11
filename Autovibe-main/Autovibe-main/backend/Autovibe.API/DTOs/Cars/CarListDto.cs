namespace Autovibe.API.DTOs.Cars;

public class CarListDto
{
    public int Id {get; set; }

    public string Make {get; set; } = string.Empty;
    public string Model {get; set; } = string.Empty;
    public int Year {get; set; }

    public decimal Price {get; set; }
    public int Mileage {get; set; }

    public string FuelType {get; set; } = string.Empty;
    public string Transmission {get; set; } = string.Empty;
    public string Color {get; set; } = string.Empty;
    public string? ShortDescription {get; set; } = string.Empty;

    public int UserId {get; set; }

    public List<string> ImageUrls {get; set; } = new List<string>();
 }