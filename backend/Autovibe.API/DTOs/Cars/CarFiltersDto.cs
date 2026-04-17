namespace Autovibe.API.DTOs.Cars;

public class CarFiltersDto
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 18;
    public int? MinYear {get; set;}
    public int? MaxYear {get; set;}
    public string? BodyType {get; set;}
    public string? FuelType {get; set; }
    public string? Transmission {get; set; }
    public string? Mileage {get; set; }
    public int? Power {get; set; }
     public string Location {get; set; } = string.Empty;
    public string SteeringWheel {get; set;} = string.Empty;
    public string Condition {get; set;} = string.Empty;


    public int? Published {get; set; }
    

    public string? SortType {get; set;}

}