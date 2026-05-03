

namespace Autovibe.API.DTOs.Users;

public class AdminUserFilterDto
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 18;
    public string? Email { get; set; }
}