using Microsoft.EntityFrameworkCore;
using Autovibe.API.Models;

namespace Autovibe.API.Data;

public class AppDbContext : DbContext
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .Property(c => c.Email)
            .IsRequired()
            .Unique();
        modelBuilder.Entity<User>()
            .Property(c => c.PasswordHash)
            .IsRequired();

        modelBuilder.Entity<Car>()
            .Property(c => c.UserId)
            .ForeignKey("User")
            .CascadeDelete();
    }
    public AppDbContext(DbContextOprions<AppDbContext> options) : base(options)
    {}
    

    public DbSet<Car> Cars {get; set; }
    public DbSet<User> Users {get; set; }
}