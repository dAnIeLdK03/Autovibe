

namespace Autovibe.API.Models;

public class Favorite
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int CarId { get; set; }
    public Car Car { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }
}