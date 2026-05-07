using Autovibe.API.Models;

namespace Autovibe.API.DTOs.Users;

public class AdminUpdateStatusDto
{
    public bool? IsBlocked {get; set;}
    public DateTime? BlockedUntil {get; set;}
    public string? BlockReason {get; set;} = string.Empty;
}