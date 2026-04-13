using Microsoft.EntityFrameworkCore;
using Autovibe.API.Models;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;

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

        modelBuilder.Entity<Car>()
           .Property(c => c.ImageUrls)
           .HasConversion(
            v => v == null || v.Count == 0 ? "[]" : JsonSerializer.Serialize(v, (JsonSerializerOptions?) null),
            v => string.IsNullOrEmpty(v) || v == "[]"
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?) null) ?? new List<string>()
           )
           .Metadata.SetValueComparer(new ValueComparer<List<string>>(
                (c1, c2) => c1!.SequenceEqual(c2!),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList()

           ));

          modelBuilder.Entity<Favorite>(entity =>
          {
              entity.HasKey(f => new { f.UserId, f.CarId});

              entity.HasOne( f => f.User)
                .WithMany()
                .HasForeignKey( f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne( f => f.Car)
                .WithMany()
                .HasForeignKey( f => f.CarId)
                .OnDelete(DeleteBehavior.Cascade);
          });
    }
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    { }


    public DbSet<Car> Cars { get; set; }
    public DbSet<User> Users { get; set; }
}