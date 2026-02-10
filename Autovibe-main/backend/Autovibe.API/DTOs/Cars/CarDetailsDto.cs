namespace Autovibe.API.DTOs.Cars;

public class CarDetailsDto
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
    
    public string Description {get; set; } = string.Empty;

    public DateTime? CreatedAt {get; set; }
    public DateTime? UpdatedAt {get; set; }

    public int SellerId {get; set; }
    public string? SellerFirstName {get; set; }
    public string? SellerLastName {get; set; }
    public string? SellerPhoneNumber {get; set; }

    public List<string> ImageUrls {get; set; } = new List<string>();
}