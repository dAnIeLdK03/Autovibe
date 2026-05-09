using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Autovibe.API.Data;
using Autovibe.API.Models;
using Microsoft.Extensions.DependencyInjection;

namespace Autovibe.API.Tests.Integration;

internal static class TestHttpHelpers
{
    internal static async Task<string> SeedUserAndLoginAsync(
        CustomWebApplicationFactory factory,
        HttpClient client,
        string email,
        string password,
        Role role)
    {
        // Arrange: create a real DB user so we exercise the full auth pipeline
        // (password hashing, token issuance, claims, auth middleware), not a mocked token.
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Users.Add(new User
            {
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = role
            });
            await db.SaveChangesAsync();
        }

        // Act: login to obtain a JWT as the API would return to a client.
        var loginRes = await client.PostAsync(
            "/api/auth/login",
            new StringContent(JsonSerializer.Serialize(new { email, password }), Encoding.UTF8, "application/json"));

        loginRes.EnsureSuccessStatusCode();

        // Note: auth response is small; we only need the token field here.
        using var doc = JsonDocument.Parse(await loginRes.Content.ReadAsStringAsync());
        return doc.RootElement.GetProperty("token").GetString()!;
    }

    internal static HttpRequestMessage WithBearer(this HttpRequestMessage req, string token)
    {
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return req;
    }
}

