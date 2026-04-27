using Autovibe.API.Data;
using Autovibe.API.Interfaces;
using Autovibe.API.Models;
using Autovibe.API.Services;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql;
using Microsoft.AspNetCore.Authentication.JwtBearer;

using Microsoft.IdentityModel.Tokens;
using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using Autovibe.API.Validations;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);



//services
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();

builder.Services.AddValidatorsFromAssemblyContaining<CarCreateDtoValidations>();



builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins(builder.Configuration["Cors:AllowedOrigins"]
            ?? throw new InvalidOperationException("AllowedOrigins not found in configuration."))
            .AllowAnyHeader()
            .AllowAnyMethod();
        });

});

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("JWT key not found in configuration.");
}

var SymmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey ?? throw new InvalidOperationException("JWT key not found in configuration.")));

var tokenValidationParameters = new TokenValidationParameters
{
    ValidateIssuerSigningKey = true,
    IssuerSigningKey = SymmetricSecurityKey,
    ValidateIssuer = false,
    ValidateAudience = false,
    ClockSkew = TimeSpan.Zero
};

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = tokenValidationParameters;
    });

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddScoped<ICarService, CarService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IFavoriteService, FavoriteService>();


builder.Services.AddControllers()
    .AddJsonOptions(opt =>
        opt.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

string connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? string.Empty;
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection'not found.");
}
builder.Services.AddDbContext<AppDbContext>(op => op.UseMySql(connectionString,
ServerVersion.AutoDetect(connectionString)));

builder.Services.AddRateLimiter(options =>
{
    options.OnRejected = async(context, ct) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        await context.HttpContext.Response.WriteAsJsonAsync( new
        {
            error = "Too many requests. Try again later."
        }, ct);
    };

     options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
  {
      var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
      return RateLimitPartition.GetFixedWindowLimiter(
          partitionKey: ip,
          factory: _ => new FixedWindowRateLimiterOptions
          {
              PermitLimit = 100,
              Window = TimeSpan.FromMinutes(1),
              AutoReplenishment = true
          });
  });

  options.AddPolicy("auth", httpContext =>
  {
      var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
      return RateLimitPartition.GetFixedWindowLimiter(
          partitionKey: ip,
          factory: _ => new FixedWindowRateLimiterOptions
          {
              PermitLimit = 10,
              Window = TimeSpan.FromMinutes(1),
              AutoReplenishment = true
          });
  });
  options.AddPolicy("upload", httpContext =>
  {
      var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
      return RateLimitPartition.GetFixedWindowLimiter(
          partitionKey: ip,
          factory: _ => new FixedWindowRateLimiterOptions
          {
              PermitLimit = 20,
              Window = TimeSpan.FromMinutes(1),
              AutoReplenishment = true
          });
  });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Autovibe Api V1");
        options.RoutePrefix = "swagger";
    });
}

app.UseStaticFiles();



//middleware

app.UseHttpsRedirection();
app.UseRouting();

app.UseExceptionHandler();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.UseRateLimiter();

app.MapControllers();

app.Run();

public partial class Program { }