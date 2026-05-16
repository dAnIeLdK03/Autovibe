using Autovibe.API.Data;
using Autovibe.API.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Autovibe.API.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication UseAppPipeline(this WebApplication app)
    {
        app.UseExceptionHandler();
        app.UseStaticFiles();
        app.UseHttpsRedirection();
        app.UseRouting();

        app.UseCors();
        app.UseAuthentication();
        app.UseMiddleware<UserBlockMiddleware>();
        app.UseAuthorization();

        app.UseRateLimiter();

        return app;
    }

    public static WebApplication MapHealthEndpoints(this WebApplication app)
    {
        app.MapGet("/health", () => Results.Ok(new { status = "ok" })).AllowAnonymous();

        app.MapGet("/ready", async (AppDbContext db, CancellationToken ct) =>
        {
            var canConnect = await db.Database.CanConnectAsync(ct);
            return canConnect
                ? Results.Ok(new { status = "ready" })
                : Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
        }).AllowAnonymous();

        return app;
    }

    public static WebApplication UseSwaggerIfDev(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "Autovibe Api V1");
                options.RoutePrefix = "swagger";
            });
        }

        return app;
    }

    public static IServiceCollection AddApiLimits(this IServiceCollection services)
    {
        services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options => {
            options.MultipartBodyLengthLimit = 10 * 1024 * 1024;
    });

        services.Configure<Microsoft.AspNetCore.Server.Kestrel.Core.KestrelServerOptions>(options =>
        {
            options.Limits.MaxRequestBodySize = 10 * 1024 * 1024;
        });

        return services;
    }
}