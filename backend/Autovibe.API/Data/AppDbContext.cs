using Microsoft.EntityFrameworkCore;
using Autovibe.API.Models;

namespace Autovibe.API.Data;

public class AppDbContext : DbContext
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .Property(u => u.Email)
            .IsRequired();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .Property(u => u.PasswordHash)
            .IsRequired();


        modelBuilder.Entity<Car>()
            .HasOne(c => c.User)
            .WithMany(u => u.Cars)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    { }


    public DbSet<Car> Cars { get; set; }
    public DbSet<User> Users { get; set; }
}