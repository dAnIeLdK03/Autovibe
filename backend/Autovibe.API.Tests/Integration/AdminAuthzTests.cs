using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Autovibe.API.Data;
using Autovibe.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

public class AdminAuthzTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public AdminAuthzTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAdmin_AsUserRole_Returns403()
    {
        var email = $"u_{Guid.NewGuid():N}@t.com";
        const string password = "TestPassword123!";

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Users.Add(new User
            {
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = Role.User
            });
            await db.SaveChangesAsync();
        }

        var loginRes = await _client.PostAsync(
            "/api/auth/login",
            new StringContent(
                JsonSerializer.Serialize(new { email, password }),
                Encoding.UTF8,
                "application/json"));
        loginRes.EnsureSuccessStatusCode();
        var loginJson = await loginRes.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(loginJson);
        var token = doc.RootElement.GetProperty("token").GetString()!;

        using var req = new HttpRequestMessage(HttpMethod.Get, "/api/Admin");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var adminRes = await _client.SendAsync(req);
        Assert.Equal(HttpStatusCode.Forbidden, adminRes.StatusCode);
    }

    [Fact]
    public async Task GetAdmin_AsAdminRole_Returns200()
    {
        var email = $"a_{Guid.NewGuid():N}@t.com";
        const string password = "TestPassword123!";

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Users.Add(new User
            {
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = Role.Admin
            });
            await db.SaveChangesAsync();
        }

        var loginRes = await _client.PostAsync(
            "/api/auth/login",
            new StringContent(
                JsonSerializer.Serialize(new { email, password }),
                Encoding.UTF8,
                "application/json"));
        loginRes.EnsureSuccessStatusCode();
        var loginJson = await loginRes.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(loginJson);
        var token = doc.RootElement.GetProperty("token").GetString()!;

        using var req = new HttpRequestMessage(HttpMethod.Get, "/api/Admin");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var adminRes = await _client.SendAsync(req);
        Assert.Equal(HttpStatusCode.OK, adminRes.StatusCode);
    }
}
