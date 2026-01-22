using Autovibe.API.Data;
using Autovibe.API.Models;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql;

var builder = WebApplication.CreateBuilder(args);



//services
builder.Services.AddControllers();

string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection'not found.");
    builder.Services.AddDbContext<AppDbContext>(op => op.UseMySql(connectionString,
    ServerVersion.AutoDetect(connectionString)));

var app = builder.Build();

//middleware
app.UseHttpsRedirection();

app.MapControllers();

app.Run();