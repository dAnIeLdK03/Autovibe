
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
        var path = context.Request.Path;
        if (path.StartsWithSegments("/api/auth/login") || path.StartsWithSegments("/api/auth/register"))
        {
            await _next(context);
            return;
        }

        if (context.User.Identity?.IsAuthenticated == true)
        {
            var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                var userStatus = await dbContext.Users
                    .AsNoTracking()
                    .Select(u => new { u.Id, u.IsBlocked, u.BlockedUntil, u.BlockReason, u.IsPermanentlyBlocked })
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
                            message = userStatus.IsPermanentlyBlocked
                                ? "Your account has been permanently blocked."
                                : $"Your account is temporary blocked until {userStatus.BlockedUntil : 0}",
                                    blockReason = userStatus.BlockReason,
                                    blockedUntil = userStatus.BlockedUntil,
                                    isPermanent = userStatus.IsBlocked
                        });
                        return;
                    }
                }
            }
        }

        await _next(context);
    }
}

