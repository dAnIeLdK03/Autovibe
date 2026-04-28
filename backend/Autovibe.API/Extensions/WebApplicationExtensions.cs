using Autovibe.API.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Autovibe.API.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication UseAppPipeline(this WebApplication app)
    {
        app.UseStaticFiles();
        app.UseHttpsRedirection();
        app.UseRouting();

        app.UseExceptionHandler();

        app.UseCors();
        app.UseAuthentication();
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
}