namespace Autovibe.API.DTOs.Cars;

public class DeletedCarsDto
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 18;
    public string BodyType {get; set; } = string.Empty;
    public string Make {get; set; } = string.Empty;
    public string Model {get; set; } = string.Empty;
    public int Year {get; set; }

    public decimal Price {get; set; }
    public int Mileage {get; set; }
    public int Power {get; set; }


    public string FuelType {get; set; } = string.Empty;
    public string Transmission {get; set; } = string.Empty;
    public string Color {get; set; } = string.Empty;
    public string? ShortDescription {get; set; } = string.Empty;
    public string Location {get; set; } = string.Empty;
    public string SteeringWheel {get; set;} = string.Empty;
    public string Condition {get; set;} = string.Empty;

    public bool IsDeleted {get; set;}
    public DateTime? DeletedAt {get; set;}

    public int UserId {get; set; }


}