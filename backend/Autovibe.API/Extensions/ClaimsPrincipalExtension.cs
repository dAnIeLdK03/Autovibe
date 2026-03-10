using System.Security.Claims;
namespace Autovibe.API.Extensions;

public static class ClaimsPrincipalExtension
{
    public static int? GetUserId(this ClaimsPrincipal user)
    {
        var userIdString = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdString, out int userId))
        {
            return userId;
        }
        return null;
    }
}
