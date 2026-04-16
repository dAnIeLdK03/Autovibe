using System.Net;

public class CarEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public CarEndpointTests(CustomWebApplicationFactory factory)
    {
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
}