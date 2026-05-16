using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Autovibe.API.Data;
using Autovibe.API.Models;
using Microsoft.Extensions.DependencyInjection;

namespace Autovibe.API.Tests.Integration;

public class BlockedUserLoginTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public BlockedUserLoginTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Login_WhenUserIsBlocked_Returns403WithMessage()
    {
        const string email = "blocked@test.com";
        const string password = "password123";
        var hash = BCrypt.Net.BCrypt.HashPassword(password);

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Users.Add(new User
            {
                Email = email,
                PasswordHash = hash,
                IsBlocked = true,
                BlockReason = "Policy violation",
                Role = Role.User,
            });
            await db.SaveChangesAsync();
        }

        var response = await _client.PostAsJsonAsync("/api/auth/login", new { email, password });
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        Assert.Contains("blocked", body, StringComparison.OrdinalIgnoreCase);

        using var doc = JsonDocument.Parse(body);
        Assert.True(doc.RootElement.TryGetProperty("message", out var msg));
        Assert.Contains("blocked", msg.GetString(), StringComparison.OrdinalIgnoreCase);
    }
}
