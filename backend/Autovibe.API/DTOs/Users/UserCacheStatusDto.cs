

public class UserCacheStatusDto
{
    public int Id {get; set; }
    public bool IsBlocked {get; set; }
    public DateTime? BlockedUntil {get; set; }
    public string? BlockReason {get; set; }
    public bool IsPermanentlyBlocked {get; set; }
}