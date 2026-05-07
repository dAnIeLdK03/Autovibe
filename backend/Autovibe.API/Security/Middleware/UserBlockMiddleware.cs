
using System.Security.Claims;
using Autovibe.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Autovibe.API.Middleware;

public class UserBlockMiddleware
{
    private readonly RequestDelegate _next;
    public UserBlockMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                var userStatus = await dbContext.Users
                    .AsNoTracking()
                    .Select(u => new { u.Id, u.IsBlocked, u.BlockedUntil })
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (userStatus != null)
                {
                    var now = DateTime.UtcNow;
                    var isTemporarilyBlocked = userStatus.BlockedUntil != null && userStatus.BlockedUntil > now;
                    var isPermanentlyBlocked = userStatus.IsBlocked;

                    if (isPermanentlyBlocked || isTemporarilyBlocked)
                    {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        await context.Response.WriteAsJsonAsync(new
                        {
                            message = "Your account is blocked. Access denied."
                        });
                        return;
                    }
                }
            }
        }

        await _next(context);
    }
}

