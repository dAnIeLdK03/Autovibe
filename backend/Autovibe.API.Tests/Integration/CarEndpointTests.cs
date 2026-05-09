using System.Net;
using System.Text.Json;
using Autovibe.API.Data;
using Autovibe.API.Models;
using Microsoft.Extensions.DependencyInjection;

public class CarEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public CarEndpointTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetCars_Return_Ok()
    {
        var res = await _client.GetAsync("/api/cars?pageNumber=1&pageSize=18");
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);

        var json = await res.Content.ReadAsStringAsync();
        Assert.Contains("\"items\"", json);
        Assert.Contains("\"pageNumber\":1", json);
    }

    [Fact]
    public async Task GetCars_ReturnsTotalItemsAndPages_AndRespectsSortType()
    {
        // Seed a deterministic set of cars to validate:
        // - pagination metadata (`totalItems`, `totalPages`) stays consistent
        // - `sortType` is not accidentally overridden by later ordering in the service.
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            if (!db.Users.Any(u => u.Id == 99))
            {
                db.Users.Add(new User { Id = 99, Email = "seed@t.com", PasswordHash = "x" });
            }

            db.Cars.AddRange(
                new Car { Id = 1001, UserId = 99, Make = "A", Model = "A", Price = 30000, Year = 2018 },
                new Car { Id = 1002, UserId = 99, Make = "B", Model = "B", Price = 10000, Year = 2020 },
                new Car { Id = 1003, UserId = 99, Make = "C", Model = "C", Price = 20000, Year = 2019 }
            );

            for (var i = 0; i < 22; i++)
            {
                db.Cars.Add(new Car
                {
                    Id = 2000 + i,
                    UserId = 99,
                    Make = "Bulk",
                    Model = $"M{i}",
                    Price = 15000 + i,
                    Year = 2010 + (i % 10)
                });
            }

            await db.SaveChangesAsync();
        }

        const int pageSize = 10;
        const int pageNumber = 1;
        var res = await _client.GetAsync($"/api/cars?pageNumber={pageNumber}&pageSize={pageSize}&sortType=PriceAsc");
        res.EnsureSuccessStatusCode();

        using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
        var root = doc.RootElement;

        Assert.Equal(pageNumber, root.GetProperty("pageNumber").GetInt32());
        Assert.Equal(pageSize, root.GetProperty("pageSize").GetInt32());

        var totalItems = root.GetProperty("totalItems").GetInt32();
        // Factory seeds at least 1 car; we only assert a safe lower-bound here.
        Assert.True(totalItems >= 25);

        var totalPages = root.GetProperty("totalPages").GetInt32();
        Assert.Equal((int)Math.Ceiling(totalItems / (double)pageSize), totalPages);

        var items = root.GetProperty("items");
        Assert.Equal(pageSize, items.GetArrayLength());

        // PriceAsc should produce non-decreasing prices across the page.
        var firstPrice = items[0].GetProperty("price").GetDecimal();
        var lastPrice = items[items.GetArrayLength() - 1].GetProperty("price").GetDecimal();
        Assert.True(firstPrice <= lastPrice);
    }
}