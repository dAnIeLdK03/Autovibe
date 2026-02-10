using System.ComponentModel.DataAnnotations;

namespace Autovibe.API.DTOs.Cars;

public class PageResponse<T>
{
    public List<T> Items {get; set; }
    public int TotalPages {get; set; }
    public int PageNumber {get; set; }
    public int PageSize {get; set; }
}