namespace Autovibe.API.DTOs.Cars;

public class PageResponse<T>
{
    public IEnumerable<T> Items { get; init; } = [];
    public int TotalPages {get; set; }
    public int PageNumber {get; set; }
    public int PageSize {get; set; }
    public int TotalItems {get; set; }

    public PageResponse(IEnumerable<T> items, int totalItems, int pageSize, int pageNumber)
    {
        Items = items;
        TotalItems = totalItems;
        PageSize = pageSize;
        PageNumber = pageNumber;

        TotalPages = totalItems == 0
            ? 0 
            : (int)Math.Ceiling((double)totalItems / pageSize);
    }

    public PageResponse() { }
}