
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

    [Fact]
    public async Task FavoriteGet_WithoutToken_Return401()
    {
        var res = await _client.GetAsync("/api/favorites?pageNumber=1&pageSize=18");
        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }

    [Fact]
    public async Task Add_Favorites_WithoutToken_Return401()
    {
        var content = new StringContent("", System.Text.Encoding.UTF8, "application/json");

        var res = await _client.PostAsync("/api/favorites/1", content);
        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }

    [Fact]
    public async Task GetUser_WithoutToken_Return401()
    {
        var res = await _client.GetAsync("/api/user/{1}");
        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);

    }
}