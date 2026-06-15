
using System.Security.Claims;
using Autovibe.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Autovibe.API.Middleware;

public class UserBlockMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IMemoryCache _cache;
    
    public UserBlockMiddleware(RequestDelegate next, IMemoryCache cache)
    {
        _next = next;
        _cache = cache;
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
                var cacheKey = $"block:{userId}";
                
                if (!_cache.TryGetValue(cacheKey, out UserCacheStatusDto? userStatus))
                {
                    userStatus = await dbContext.Users
                        .AsNoTracking()
                        .Where(u => u.Id == userId)
                        .Select(u => new UserCacheStatusDto
                        {
                            Id = u.Id,
                            IsBlocked = u.IsBlocked,
                            BlockedUntil = u.BlockedUntil,
                            BlockReason = u.BlockReason,
                            IsPermanentlyBlocked = u.IsPermanentlyBlocked
                        })
                        .FirstOrDefaultAsync();

                    if (userStatus != null)
                    {
                        _cache.Set(cacheKey, userStatus, TimeSpan.FromMinutes(1));
                    }
                }

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
                                : $"Your account is temporary blocked until {userStatus.BlockedUntil:yyyy-MM-dd HH:mm} UTC", // Малка корекция на интервала пред UTC
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
