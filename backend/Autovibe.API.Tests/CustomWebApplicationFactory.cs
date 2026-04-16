using Autovibe.API.Data;
using Autovibe.API.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = $"autovibe_integration_tests_{Guid.NewGuid():N}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var dbDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>)
            );
            if(dbDescriptor is not null)
                services.Remove(dbDescriptor);

            services.AddDbContext<AppDbContext>(opt =>
                opt.UseInMemoryDatabase(_dbName));

            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            db.Database.EnsureCreated();

            if (!db.Users.Any())
            {
                db.Users.Add(new User {Id = 1, Email = "u@u.com", PasswordHash = "x"});
            }

            if (!db.Cars.Any())
            {
                db.Cars.Add(new Car {Id = 1, UserId = 1, Make = "BMW", Model = "X3", Price = 10000});
            }

            db.SaveChanges();
        });
    }
}