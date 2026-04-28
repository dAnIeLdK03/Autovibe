using Autovibe.API.Data;
using Autovibe.API.Exceptions;
using Autovibe.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

namespace Autovibe.API.Extensions;

public static class InfrastructureExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();

        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins(config["Cors:AllowedOrigins"]
                    ?? throw new InvalidOperationException("AllowedOrigins not found in configuration."))
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        var cs = config.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(cs))
            throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        services.AddDbContext<AppDbContext>(op =>
            op.UseMySql(cs, ServerVersion.AutoDetect(cs)));

        services.AddRateLimiter(options =>
        {
            options.OnRejected = async (context, ct) =>
            {
                context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                await context.HttpContext.Response.WriteAsJsonAsync(new { error = "Too many requests. Try again later." }, ct);
            };

            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
            {
                var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 100,
                    Window = TimeSpan.FromMinutes(1),
                    AutoReplenishment = true
                });
            });

            options.AddPolicy("auth", httpContext =>
            {
                var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 10,
                    Window = TimeSpan.FromMinutes(1),
                    AutoReplenishment = true
                });
            });

            options.AddPolicy("upload", httpContext =>
            {
                var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 20,
                    Window = TimeSpan.FromMinutes(1),
                    AutoReplenishment = true
                });
            });
        });

        services.Configure<JwtSettings>(config.GetSection("Jwt"));

        return services;
    }
}