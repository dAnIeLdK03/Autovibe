
using Xunit;
using System.Net;

public class AuthzTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public AuthzTests(CustomWebApplicationFactory factory)
    => _client = factory.CreateClient();

    [Fact]
    public async Task GetMyCars_WithoutToken_Returns401()
    {
        var res = await _client.GetAsync("/api/cars/my-cars?pageNumber=1&pageSize=18");
        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }
}