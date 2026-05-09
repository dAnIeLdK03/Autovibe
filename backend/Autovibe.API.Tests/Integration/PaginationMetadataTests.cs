using System.Net;
using System.Text.Json;
using Autovibe.API.Data;
using Autovibe.API.Models;
using Autovibe.API.Tests.Integration;
using Microsoft.Extensions.DependencyInjection;

public class PaginationMetadataTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public PaginationMetadataTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Favorites_Get_ReturnsTotalItemsAndCorrectTotalPages()
    {
        var email = $"fav_{Guid.NewGuid():N}@t.com";
        const string password = "TestPassword123!";

        var token = await TestHttpHelpers.SeedUserAndLoginAsync(_factory, _client, email, password, Role.User);

        int userId;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            userId = db.Users.Single(u => u.Email == email).Id;

            // Favorites endpoint returns cars, so ensure target cars exist.
            db.Cars.AddRange(
                new Car { Id = 5001, UserId = 1, Make = "F", Model = "1", Price = 1, Year = 2010 },
                new Car { Id = 5002, UserId = 1, Make = "F", Model = "2", Price = 2, Year = 2011 },
                new Car { Id = 5003, UserId = 1, Make = "F", Model = "3", Price = 3, Year = 2012 }
            );

            db.Favorites.AddRange(
                new Favorite { UserId = userId, CarId = 5001, CreatedAt = DateTime.UtcNow, IsDeleted = false },
                new Favorite { UserId = userId, CarId = 5002, CreatedAt = DateTime.UtcNow, IsDeleted = false },
                // Soft-deleted favorites must not affect `totalItems`.
                new Favorite { UserId = userId, CarId = 5003, CreatedAt = DateTime.UtcNow, IsDeleted = true }
            );

            await db.SaveChangesAsync();
        }

        // pageSize=1 => totalPages should equal totalItems when totalItems > 0.
        using var req = new HttpRequestMessage(HttpMethod.Get, "/api/favorites?pageNumber=1&pageSize=1").WithBearer(token);
        var res = await _client.SendAsync(req);
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);

        using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
        var root = doc.RootElement;

        Assert.Equal(1, root.GetProperty("pageNumber").GetInt32());
        Assert.Equal(1, root.GetProperty("pageSize").GetInt32());
        Assert.Equal(2, root.GetProperty("totalItems").GetInt32());
        Assert.Equal(2, root.GetProperty("totalPages").GetInt32());

        Assert.Equal(1, root.GetProperty("items").GetArrayLength());
    }

    [Fact]
    public async Task Admin_Get_ReturnsTotalItemsAndCorrectTotalPages()
    {
        var email = $"admin_{Guid.NewGuid():N}@t.com";
        const string password = "TestPassword123!";

        var token = await TestHttpHelpers.SeedUserAndLoginAsync(_factory, _client, email, password, Role.Admin);

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            // Seed enough users to ensure paging isn't accidentally hardcoded/ignored.
            for (var i = 0; i < 6; i++)
            {
                db.Users.Add(new User
                {
                    Email = $"u_{Guid.NewGuid():N}@t.com",
                    PasswordHash = "x",
                    Role = Role.User
                });
            }
            await db.SaveChangesAsync();
        }

        const int pageSize = 5;
        using var req = new HttpRequestMessage(HttpMethod.Get, $"/api/admin?pageNumber=1&pageSize={pageSize}")
            .WithBearer(token);
        var res = await _client.SendAsync(req);
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);

        using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
        var root = doc.RootElement;

        var totalItems = root.GetProperty("totalItems").GetInt32();
        // Factory also seeds one default user; we only require a safe lower-bound.
        Assert.True(totalItems >= 7);

        var totalPages = root.GetProperty("totalPages").GetInt32();
        Assert.Equal((int)Math.Ceiling(totalItems / (double)pageSize), totalPages);
        Assert.Equal(1, root.GetProperty("pageNumber").GetInt32());
        Assert.Equal(pageSize, root.GetProperty("pageSize").GetInt32());
    }
}

