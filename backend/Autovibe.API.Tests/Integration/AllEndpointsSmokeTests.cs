using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Autovibe.API.Data;
using Autovibe.API.Models;
using Autovibe.API.Tests.Integration;
using Microsoft.Extensions.DependencyInjection;

public class AllEndpointsSmokeTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    public AllEndpointsSmokeTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Anonymous_HealthAndReady_AreReachable()
    {
        var health = await _client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, health.StatusCode);

        using (var doc = JsonDocument.Parse(await health.Content.ReadAsStringAsync()))
        {
            Assert.Equal("ok", doc.RootElement.GetProperty("status").GetString());
        }

        var ready = await _client.GetAsync("/ready");
        Assert.Equal(HttpStatusCode.OK, ready.StatusCode);

        using (var doc = JsonDocument.Parse(await ready.Content.ReadAsStringAsync()))
        {
            Assert.Equal("ready", doc.RootElement.GetProperty("status").GetString());
        }
    }

    [Fact]
    public async Task Full_SmokeFlow_Covers_All_Controllers()
    {
        var email = $"e2e_{Guid.NewGuid():N}@t.com";
        const string password = "TestPassword123!";

        var registerRes = await _client.PostAsync(
            "/api/auth/register",
            new StringContent(
                JsonSerializer.Serialize(new
                {
                    email,
                    password,
                    confirmPassword = password,
                    firstName = "Test",
                    lastName = "User",
                    phoneNumber = "0888123456"
                }, JsonOpts),
                Encoding.UTF8,
                "application/json"));

        Assert.Equal(HttpStatusCode.Created, registerRes.StatusCode);

        var loginRes = await _client.PostAsync(
            "/api/auth/login",
            new StringContent(
                JsonSerializer.Serialize(new { email, password }, JsonOpts),
                Encoding.UTF8,
                "application/json"));
        loginRes.EnsureSuccessStatusCode();

        string token;
        using (var doc = JsonDocument.Parse(await loginRes.Content.ReadAsStringAsync()))
        {
            token = doc.RootElement.GetProperty("token").GetString()!;
        }

        int userId;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            userId = db.Users.Single(u => u.Email == email).Id;
        }

        {
            using var req = new HttpRequestMessage(HttpMethod.Get, "/api/user").WithBearer(token);
            var res = await _client.SendAsync(req);
            res.EnsureSuccessStatusCode();
        }

        {
            using var req = new HttpRequestMessage(HttpMethod.Get, $"/api/user/{userId}").WithBearer(token);
            var res = await _client.SendAsync(req);
            res.EnsureSuccessStatusCode();
        }

        {
            using var req = new HttpRequestMessage(HttpMethod.Put, $"/api/user/{userId}")
                .WithBearer(token);
            req.Content = new StringContent(
                JsonSerializer.Serialize(new
                {
                    firstName = "TestUpdated",
                    lastName = "UserUpdated",
                    phoneNumber = "0888123456"
                }, JsonOpts),
                Encoding.UTF8,
                "application/json");
            var res = await _client.SendAsync(req);
            res.EnsureSuccessStatusCode();
        }

        {
            using var req = new HttpRequestMessage(HttpMethod.Put, "/api/user/change-password")
                .WithBearer(token);
            req.Content = new StringContent(
                JsonSerializer.Serialize(new
                {
                    currentPassword = password,
                    newPassword = "TestPassword1234!",
                    confirmPassword = "TestPassword1234!"
                }, JsonOpts),
                Encoding.UTF8,
                "application/json");
            var res = await _client.SendAsync(req);
            Assert.Equal(HttpStatusCode.NoContent, res.StatusCode);
        }

        int carId;
        {
            var list = await _client.GetAsync("/api/cars?pageNumber=1&pageSize=5&sortType=Newest");
            list.EnsureSuccessStatusCode();

            using var req = new HttpRequestMessage(HttpMethod.Post, "/api/cars").WithBearer(token);
            req.Content = new StringContent(
                JsonSerializer.Serialize(new
                {
                    make = "BMW",
                    model = "X5",
                    year = 2019,
                    price = 25000,
                    mileage = 123000,
                    power = 200,
                    fuelType = "Diesel",
                    transmission = "Automatic",
                    color = "Black",
                    description = "A valid description long enough.",
                    bodyType = "SUV",
                    location = "Sofia",
                    steeringWheel = "Left",
                    condition = "Used",
                    imageUrls = Array.Empty<string>()
                }, JsonOpts),
                Encoding.UTF8,
                "application/json");

            var created = await _client.SendAsync(req);
            created.EnsureSuccessStatusCode();

            using var doc = JsonDocument.Parse(await created.Content.ReadAsStringAsync());
            carId = doc.RootElement.GetProperty("id").GetInt32();
        }

        {
            var details = await _client.GetAsync($"/api/cars/{carId}");
            details.EnsureSuccessStatusCode();
        }

        {
            using var req = new HttpRequestMessage(HttpMethod.Put, $"/api/cars/{carId}").WithBearer(token);
            req.Content = new StringContent(
                JsonSerializer.Serialize(new
                {
                    make = "BMW",
                    model = "X5",
                    year = 2019,
                    price = 24000,
                    mileage = 123000,
                    power = 200,
                    fuelType = "Diesel",
                    transmission = "Automatic",
                    color = "Black",
                    description = "A valid description long enough (updated).",
                    bodyType = "SUV",
                    location = "Sofia",
                    steeringWheel = "Left",
                    condition = "Used",
                    imageUrls = Array.Empty<string>()
                }, JsonOpts),
                Encoding.UTF8,
                "application/json");

            var res = await _client.SendAsync(req);
            res.EnsureSuccessStatusCode();
        }

        {
            using var req = new HttpRequestMessage(HttpMethod.Get, "/api/cars/my-cars?pageNumber=1&pageSize=5")
                .WithBearer(token);
            var res = await _client.SendAsync(req);
            res.EnsureSuccessStatusCode();
        }

        {
            var png = Convert.FromBase64String(
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4//8/AAX+Av4N70a4AAAAAElFTkSuQmCC");

            using var form = new MultipartFormDataContent();
            var fileContent = new ByteArrayContent(png);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue("image/png");
            form.Add(fileContent, "file", "test.png");

            using var req = new HttpRequestMessage(HttpMethod.Post, "/api/cars/upload-image").WithBearer(token);
            req.Content = form;
            var res = await _client.SendAsync(req);
            res.EnsureSuccessStatusCode();

            using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
            Assert.True(doc.RootElement.TryGetProperty("url", out _));
        }

        {
            using var req = new HttpRequestMessage(HttpMethod.Delete, $"/api/cars/{carId}").WithBearer(token);
            var res = await _client.SendAsync(req);
            Assert.Equal(HttpStatusCode.NoContent, res.StatusCode);
        }

        {
            using var addReq = new HttpRequestMessage(HttpMethod.Post, "/api/favorites/1").WithBearer(token);
            addReq.Content = new StringContent("", Encoding.UTF8, "application/json");
            var addRes = await _client.SendAsync(addReq);
            Assert.Equal(HttpStatusCode.NoContent, addRes.StatusCode);

            using var getReq = new HttpRequestMessage(HttpMethod.Get, "/api/favorites?pageNumber=1&pageSize=5").WithBearer(token);
            var getRes = await _client.SendAsync(getReq);
            getRes.EnsureSuccessStatusCode();

            using var delReq = new HttpRequestMessage(HttpMethod.Delete, "/api/favorites/1").WithBearer(token);
            var delRes = await _client.SendAsync(delReq);
            Assert.Equal(HttpStatusCode.NoContent, delRes.StatusCode);
        }

        var adminEmail = $"admin_e2e_{Guid.NewGuid():N}@t.com";
        const string adminPassword = "TestPassword123!";
        var adminToken = await TestHttpHelpers.SeedUserAndLoginAsync(_factory, _client, adminEmail, adminPassword, Role.Admin);

        {
            using var req = new HttpRequestMessage(HttpMethod.Get, "/api/admin?pageNumber=1&pageSize=5").WithBearer(adminToken);
            var res = await _client.SendAsync(req);
            res.EnsureSuccessStatusCode();
        }

        {
            using var req = new HttpRequestMessage(HttpMethod.Get, "/api/admin/deleted").WithBearer(adminToken);
            var res = await _client.SendAsync(req);
            res.EnsureSuccessStatusCode();
        }

        {
            using var req = new HttpRequestMessage(HttpMethod.Patch, $"/api/admin/{userId}/status").WithBearer(adminToken);
            req.Content = new StringContent(
                JsonSerializer.Serialize(new
                {
                    isBlocked = true,
                    blockedUntil = DateTime.UtcNow.AddDays(1),
                    blockReason = "test"
                }, JsonOpts),
                Encoding.UTF8,
                "application/json");
            var res = await _client.SendAsync(req);
            res.EnsureSuccessStatusCode();
        }

        {
            using var req = new HttpRequestMessage(HttpMethod.Patch, $"/api/admin/{userId}/role").WithBearer(adminToken);
            req.Content = new StringContent(
                JsonSerializer.Serialize(new { role = Role.User }, JsonOpts),
                Encoding.UTF8,
                "application/json");
            var res = await _client.SendAsync(req);
            res.EnsureSuccessStatusCode();
        }
    }
}

